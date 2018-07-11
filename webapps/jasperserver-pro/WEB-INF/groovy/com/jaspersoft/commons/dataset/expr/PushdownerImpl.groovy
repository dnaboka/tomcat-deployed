/*
 * Copyright © 2005 - 2018 TIBCO Software Inc. All Rights Reserved. Confidential & Proprietary.
 */

package com.jaspersoft.commons.dataset.expr

import com.jaspersoft.commons.dataset.expr.AggregateCreator.Function;

/**
 * this class takes an aggregate expression and splits it into two levels--
 * one or more agg expressions on a base query and a top-level expression rolling up the base query results.
 * The pushDown() method takes the original expression and traverses it, creating aggregate and group expressions
 * along the way, which populate the Pushdown object returned by pushDown().
 * @author btinsman
 *
 */
class PushdownerImpl extends ExpressionTransformerImpl implements Pushdowner {
    TwoLevelExpression twoLevelExpr
    
    PushdownerImpl() {
        super(null)
    }
    
    ExpressionEvaluator getEval() {
        expressionEvaluator
    }
    
    synchronized TwoLevelExpression pushDown(Expression orig) {
        twoLevelExpr = new TwoLevelExpression(orig)
        twoLevelExpr.topExpression = get(orig)
        return twoLevelExpr
    }
    
    Expression get(Operator op) {
        String opName = op.definition.name
        // make sure none of the args are in-memory funcs
        // if they are, don't bother trying to push down
        // NOTE: there are agg functions, such as Range and PercentOf, which are done in memory, 
        // but whose operands can be pushed down.
        // If you want to have them pushed down, you have to set inMemory = false.
        if (op.operands.any { ExpressionEvaluator.isInMemory(it) }) {
            return passThrough(opName, op.operands, op.paren)
        }
        // recurse to operands first
        def pdArgs = op.operands.collect { get((Expression) it) }
        // if any operands got pushed down, don't do any more pushing down or you will warp the fabric of spacetime
        if (pdArgs.any { ExpressionEvaluator.isAggregate(it) }) {
            // println "pass through($opName, $pdArgs, $op.paren)"
            return passThrough(opName, pdArgs, op.paren)
        }
        // dynamic invoke--this bit of grooviness will look up a method whose name matches the op definition name,
        // and whose arguments match pdArgs. If a matching method isn't found, methodMissing() is called,
        // which performs default handling.
        def result = "$opName"(*pdArgs)
        // pass on parens if applicable
        if (result instanceof Operator && op.paren) {
            result.paren = true
        }
        result
    }

    def addBaseVariable(func, Expression... exprs) {
        def varName = twoLevelExpr.addBaseExpression(eval.getOperator(func, exprs))
        eval.getVariable(varName)
    }
    
    // default operator handler
    def methodMissing(String name, args) {
        // handle RangeYears, RangeSemis, etc
        if (name.startsWith("Range")) {
            return handleDateTimeRange(name, args)
        }
        return passThrough(name, args)
    }

    // default handling for things we can't push down
    def passThrough(String name, args, paren = false) {
        return eval.getOperator(name, args as Expression[]).setParen(paren)
    }
        
    // Sum, Min, and Max have same funcs on both levels
    def Sum(Expression expr, Expression level = null) {
        def baseSum = addBaseVariable(Function.Sum, expr)
        eval.getOperator(Function.Sum, baseSum, level)
    }

    def Max(Expression expr, Expression level = null) {
        def baseMax = addBaseVariable("Max", expr)
        eval.getOperator("Max", baseMax, level)
    }

    def Min(Expression expr, Expression level = null) {
        def baseMin = addBaseVariable("Min", expr)
        eval.getOperator("Min", baseMin, level)
    }

    // CountAll rolls up with Sum
    def CountAll(Expression expr = null, Expression level = null) {
        def baseCount = addBaseVariable(Function.CountAll, expr)
        eval.getOperator(Function.Sum, baseCount, level)
    }
    
    // Average based on sum and count
    // generate those and recurse to get them pushed down
    // then take the quotient
    def Average(Expression expr, Expression level = null) {
        def sum = eval.getOperator(Function.Sum, expr, level)
        def count = eval.getOperator(Function.CountAll, expr, level)
        sum = get(sum)
        count = get(count)
        eval.getOperator("divide", sum, count)
    }
    
    // PercentOf rolls up with Sum
    def PercentOf(Expression expr, Expression level = null) {
        def baseSum = addBaseVariable(Function.Sum, expr)
        eval.getOperator("PercentOf", baseSum, level)
    }
    
    // numeric range composed of max and min
    def Range(Expression expr = null, Expression level = null) {
        def max = eval.getOperator("Max", expr, level)
        def min = eval.getOperator("Min", expr, level)
        max = get(max)
        min = get(min)
        eval.getOperator("subtract", max, min)
    }
    
    // date/time range also uses max and min
    // covers RangeMinutes, RangeHours, RangeDays, RangeWeeks, RangeMonths, RangeQuarters, RangeSemis, RangeYears

    def handleDateTimeRange(String funcName, Object[] args) {
        Expression expr = args[0]
        Expression level = args.length > 1 ? args[1] : null
        def max = eval.getOperator("Max", expr, level)
        def min = eval.getOperator("Min", expr, level)
        max = get(max)
        min = get(min)
        // use corresponding ElapsedX method to compute diff between max and min; for RangeYears use ElapsedYears, etc
        def elapsedFunc = funcName.replace("Range", "Elapsed")
        eval.getOperator(elapsedFunc, max, min)
    }
    
    // CountDistinct adds a group on its argument, but works the same way
    def CountDistinct(Expression expr, Expression level = null) {
        def groupExpr = handleGroup(expr);
        eval.getOperator("CountDistinct", groupExpr, level);
    }
    
    // TODO this logic duplicates GroupCalculation, but in that case, HybridCalc methods are called directly
    Expression handleGroup(Expression groupExpr) {
        if (ExpressionEvaluator.isConstantExpression(groupExpr)) {
            return groupExpr
        } else if (ExpressionEvaluator.isInMemory(groupExpr)) {
            // create base fields for all vars in the expression, then return the same expr for processing in memory
            ExpressionEvaluator.getVariables(groupExpr).each { var -> twoLevelExpr.addGroup(var) }
            return groupExpr
        } else {
            // create a field for grouping
            String groupFieldName = twoLevelExpr.addGroup(groupExpr);
            // the mem expression should just be the field returned by the base query
            return eval.getVariable(groupFieldName)
        }

    }

}
