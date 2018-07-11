/*
 * Copyright © 2005 - 2018 TIBCO Software Inc. All Rights Reserved. Confidential & Proprietary.
 */

package com.jaspersoft.commons.dataset.expr

import com.jaspersoft.commons.dataset.expr.ArithmeticOperator;
import com.jaspersoft.commons.dataset.expr.ComparisonOperator;
import com.jaspersoft.commons.dataset.expr.Expression;
import com.jaspersoft.commons.dataset.expr.ExpressionEvaluator;
import com.jaspersoft.commons.dataset.expr.In;
import com.jaspersoft.commons.dataset.expr.LogicalOperator;
import com.jaspersoft.commons.dataset.expr.Operator;
import com.jaspersoft.commons.dataset.expr.AggregateCreator.Function;

/**
 * This class performs a transformation of aggregate functions containing ratio operators ("/" or "%").
 * It will turn "Sum(x/y)" into "Sum(x)/Sum(y)", but it has various other permutations.
 * @author btinsman
 *
 */
class RatioTransformer extends ExpressionTransformerImpl {
	boolean applySum;
	Expression levelArg;
	
    RatioTransformer() {
        super(null)
    }
    
    ExpressionEvaluator getEval() {
        expressionEvaluator
    }
    
	def p(Object[] args) { System.out.println(args?.join(" ")) }
	/**
	 * look for sum or average aggregate on either "/" or "%"
	 */
	Expression getOperator(Operator expr) {
		ExpressionEvaluator eval = getExpressionEvaluator();
	    if (expr.getDefinition().getName().equals(Function.Sum.name()) || expr.getDefinition().getName().equals(Function.Average.name())) {
	        // Sum and Average can have one or two operands
	        // We will try to apply the sum on lower-level expressions if we find the right pattern.
	    	// Save the second (level) arg to pass that down too,
	    	// then set a flag and recurse.
	        Expression aggArg = expr.getOperand(0);
	        levelArg = expr.getOperandCount() == 2 ? expr.getOperand(1) : null;
	        applySum = true;
	        Expression newAggArg = get(aggArg);
	        // if it didn't change, then return the original unchanged
	        // if it did change, then sum was applied to args, so return the transformed arg
	    	// Note: if we have a Sum under a Sum, it should be correct to act on the lowest-level sum that we find, and leave the higher ones alone.
	    	// In that case, the returned expression will be different, but applySum will be false.
	        Expression ret;
	        // if the original arg didn't change, or it did change but produced an invalid aggregate (mix of agg and scalar), return original expr
			// Bug 33374: we added another test for this below; this might be redundant
	        if (eval.equals(newAggArg, aggArg) || ! ExpressionEvaluator.isValidAggregate(newAggArg)) {
	        	ret = expr;
	        } else {
	        	ret = newAggArg;
	        }
	        // turn flag back off
	        applySum = false;
        	return ret;
	    } else if (applySum) {
	    	// do depth-first recursion on operands, so that sum is applied as deeply as possible.
	    	// test if we can apply on this level
	    	boolean applySumThisLevel = applyAggregatesToOperands(expr); 
    		Operator newOp = eval.getOperator(expr.getName());
    		// test recursing on each operand; if we can apply sum on this level, and sum was not applied at a lower level, apply sum
    		for (Expression operand : expr.getOperands()) {
    			Expression xformed = get(operand);
    			boolean changed = ! eval.equals(xformed, operand);
    			if (! changed && applySumThisLevel) {
    				newOp.addOperand(eval.getOperator(Function.Sum, operand, levelArg));
    			} else {
    				newOp.addOperand(xformed);
    			}
    		}
			// Bug 33374: if the resulting expression would be a mix of aggs and non-aggs, return the original.
			// This test was applied at a different point in the transformation above...
			Expression ret
			if (ExpressionEvaluator.isValidAggregate(newOp)) {
				newOp.setParen(true)
				ret = newOp
			} else {
				ret = expr
			}
			return ret;
	    } else {
			return super.getOperator(expr);
	    }
	}
	
	/**
	 * This function determines how we apply the aggregate operator on top of another operator:
	 * If we return false, the operator is aggregated
	 * If we return true, the operands are aggregated, then passed as arguments to the operator
	 * @param expr
	 * @return
	 */
	boolean applyAggregatesToOperands(Operator op) {
		// only applies for ratios
		if (! op.getName().equals(ArithmeticOperator.DIVIDE) && ! op.getName().equals(ArithmeticOperator.PERCENT_FIELD_RATIO)) {
		    return false;
		}
		// If both args are non-constants, we do the transformation
		// We are not trying to apply aggs at the same time as we were doing in 5.5.
		// If there are aggs inside aggs, treat them the same as non-aggs.
		// Normal case: sum(a / b) -> sum(a) / sum(b)
		// Possible case: sum(sum(a) / b) -> sum(sum(a)) / sum(b)
        return ! (ExpressionEvaluator.isConstantExpression(op.getLHS()) || ExpressionEvaluator.isConstantExpression(op.getRHS()));
	}

}
