/*
 * Copyright © 2005 - 2018 TIBCO Software Inc. All Rights Reserved. Confidential & Proprietary.
 */

package com.jaspersoft.commons.dataset.expr

class DomELMetadataHelper implements FunctionFilter, ExpressionValidator {
    private def showZeroForNullFunctions = [ 'Sum', 'Average', 'StdDevS', 'StdDevP', 'Range', "RangeMinutes", "RangeHours", "RangeDays",
											 "RangeWeeks", "RangeMonths", "RangeQuarters", "RangeSemis", "RangeYears"] as Set;


    List<OperatorDefinition> filter(List<OperatorDefinition> origList) {
		origList.findAll { OperatorDefinition opDef -> opDef.testProperty('inAvailableFunctions')}
	}
	
	List<String> getValidAggregateFunctions(Expression expr) {
		Set<String> aggList = new LinkedHashSet<String>()
		if (! ExpressionEvaluator.isAggregate(expr)) {
			if (TypeUtil.isNumeric(expr.javaType)) {
				aggList.addAll(["Sum", "Average", "WeightedAverage", "Max", "Min", "StdDevP", "StdDevS",
                                 "Median", "Range"])
			//} else if (TypeUtil.getSuperType(expr.javaType) in ["date", "timestamp", "time"]) {
			//	aggList.addAll(["Max", "Min", "Mode", "Median", "Range", "RangeMinutes", "RangeHours", "RangeDays",
            //            "RangeWeeks", "RangeMonths", "RangeQuarters", "RangeSemi", "RangeYears"])
			}
            //
            // http://bugzilla.jaspersoft.com/show_bug.cgi?id=37240
            // Mode applies to ALL datatypes
            //
			aggList.addAll(["CountAll", "CountDistinct", "Mode"])
		} else if (ExpressionEvaluator.isValidAggregate(expr)) {
			aggList.add("AggregateFormula");
		}
        // scalar and aggregate Date Time types can have Date Time summaries
        if (TypeUtil.getSuperType(expr.javaType) in ["date", "timestamp", "time"]) {
            aggList.addAll(["Max", "Min", "Mode", "Median", "RangeMinutes", "RangeHours", "RangeDays",
                            "RangeWeeks", "RangeMonths", "RangeQuarters", "RangeSemis", "RangeYears"])
        }
		aggList.addAll(["Custom", "None"])

		return aggList as List<String>
	}


    List<String> getValidTimeAggregateFunctions(Expression expr) {
        Set<String> aggList = new LinkedHashSet<String>()
       // if (! ExpressionEvaluator.isAggregate(expr)) {
            if (TypeUtil.isNumeric(expr.javaType)) {
                aggList.addAll(["TimeBalanceAverage",
                                "TimeBalanceSum",
                                "TimeBalanceLast",
                                "TimeBalanceFirst"])
                //} else if (TypeUtil.getSuperType(expr.javaType) in ["date", "timestamp", "time"]) {
                //	aggList.addAll(["Max", "Min", "Mode", "Median", "Range", "RangeMinutes", "RangeHours", "RangeDays",
                //            "RangeWeeks", "RangeMonths", "RangeQuarters", "RangeSemi", "RangeYears"])
            }
            //
            // http://bugzilla.jaspersoft.com/show_bug.cgi?id=37240
            // Mode applies to ALL datatypes
            //
           // aggList.addAll(["CountAll", "CountDistinct", "Mode"])
        //} else if (ExpressionEvaluator.isValidAggregate(expr)) {
         //   aggList.add("AggregateFormula");
       // }
        // scalar and aggregate Date Time types can have Date Time summaries
       // if (TypeUtil.getSuperType(expr.javaType) in ["date", "timestamp", "time"]) {
          //  aggList.addAll(["Max", "Min", "Mode", "Median", "RangeMinutes", "RangeHours", "RangeDays",
          //                  "RangeWeeks", "RangeMonths", "RangeQuarters", "RangeSemis", "RangeYears"])
        //}
        //aggList.addAll(["Custom", "None"])
        return aggList as List<String>
    }

	/*
	 * rollup xform
	 * sum: sum(sum)
	 * max: max(max)
	 * min: min(min)
	 * count: sum(count)
	 * distinctCount: bzzt!
	 * average: sum(sum) / sum(count)
	 * range: max(max) - min(min)
	 * weightedAverage: weightedAverage(sum1, sum2)
	 * 
	 */
	@Override
	public String getDefaultAggregateFunction(Expression expr) {
		if (! ExpressionEvaluator.isAggregate(expr)) {
			if (TypeUtil.isNumeric(expr.javaType)) {
				return "Sum"
			} else {
				return "CountAll"
			}
		} else if (ExpressionEvaluator.isValidAggregate(expr)) {
            // we used to have a "Same" function which meant that agg expression was the same as expression.
            // instead of doing that, we set it to Custom and init the agg expression from expression.
            // see MetadataService.doValidate()
            return "AggregateFormula"
		} else {
            return "None"
		}
	}

	// TODO aggregate error types, including custom summary validation
	@Override
	public Expression getAggregateExpression(ExpressionEvaluator eval, Expression expression, String aggregateFunction, String aggregateArg, boolean preventNulls) {
		if (! getValidAggregateFunctions(expression).contains(aggregateFunction)) {
			// throw something
		}
		switch (aggregateFunction) {
			case "Custom":
				// should not be called, because agg expression is user-supplied, not generated
				return
            case "AggregateFormula":
                return expression
			case "None":
				return eval.getLiteral(null)
			case "WeightedAverage":
			// test for arg: non-null, valid field
				def weightVar = eval.getVariable(aggregateArg)
				return eval.getOperator(aggregateFunction, expression, weightVar)
            //
            // http://bugzilla.jaspersoft.com/show_bug.cgi?id=37334
            //
            // In the original case, we were creating an expression "CountAll(groovy('now()'))",
			// but GroovyGenerator was blowing up, so we tried to detect the case and use just "CountAll()".
			// However, the fix was returning "CountAll()" all the time, which means that you are counting nulls which is wrong.
			// FIXME a better place to do this optimization is in PushdownerImpl, which has domain calc fields expanded. 
            //
            case "CountAll":
              if (eval.isConstantExpression(expression)) {
                return eval.getOperator(aggregateFunction);   // use no-arg CountAll for Constant args
              }
              // else fall through to default
			default:

                // generate other aggs
                // HybridAggregateTransformer still handles divide, expands the calc fields and splits sql/mem
                def agg = eval.getOperator(aggregateFunction, expression)

                // For Sum, Average, StdDevS and StdDevP we can control whether to display null value as zero
                if (preventNulls && showZeroForNullFunctions.contains(aggregateFunction)) {
                    return formatNullAsZero(eval, agg);
                }
                return agg
        }
	}

    /**
     * Generate conditional wrapper expression for replacing null values with 0.
     * @param eval
     * @param agg
     * @return
     */
    private static Expression formatNullAsZero(ExpressionEvaluator eval, Expression agg) {
        def eq = eval.getOperator(ComparisonOperator.EQUALS, agg, eval.getLiteral(null))
        eval.getOperator('IF', eq, eval.getLiteral(0), agg)
    }
	
	public void checkFunctionsAndArguments(ExpressionEvaluator eval, Expression expression) throws FieldException {
		final def errList = []
		new ExpressionWalker() {
			void operator(Operator op) {
				// test for invalid function
				if (op.definition.testProperty("invalid")) {
					throw new FieldException(FieldException.Type.INVALID_FUNCTION, op.name)
				}
				op.definition.validate(eval, op)
				// recurse to the operators
				for (Expression operand : op.getOperands()) {
					walk(operand);
				}
			}
		}.walk(expression)
	}
	public void checkCircularReferences(ExpressionEvaluator eval, String fieldName, Expression expression) throws FieldException {
		// see if you end up with a self-reference
		new ExpressionTransformerImpl(eval) {
			Expression getVariable(Variable v) {
				// bzzt, found the cycle
				if (v.field.name == fieldName) {
					throw new FieldException(FieldException.Type.CIRCULAR_REFERENCE, fieldName, expression)
				}
				// expand calc fields, otherwise just return the var
				if (v.field.expression) {
					return get(eval.parseExpression(v.field.expression))
				}
				return v
			}
		}.get(expression)
	}
	
    // hook to allow setting of formats
    String getDefaultFormat(ExpressionEvaluator eval, Expression expression) {
        null
    }
    
    void p(String s) {
        System.err.println("DomELMetadataHelper: "+s);
    }
    
    def methodMissing(String func, args) {
        null
    }

    public Object evalFormula(ExpressionEvaluator eval, String exprString, Object[] args) {
        Operator expr = eval.parseExpression(exprString)
        def func = expr.definition.name

        // http://bugzilla.jaspersoft.com/show_bug.cgi?id=37631
        //   DEBUG print got into production code.   Disable it
        //
        //p("$func $args")

        "$func"(*args)
    }
	def add(long[] args) { BigInteger total = 0; args.each { if (it != null) total += it }; return total }
    
    def add(double[] args) { double total = 0; args.each { if (it != null) total += it }; return total }
    
    def add(Object[] args) { BigDecimal total = 0; args.each { if (it != null) total += it }; return total }
    
    def subtract(arg1, arg2) { (arg1 ?: 0) - (arg2 ?: 0) }
    
    def multiply(long[] args) { long total = 1; args.each { total *= (it ?: 0) }; return total }
    
    def multiply(double[] args) { double total = 1; args.each { total *= (it ?: 0) }; return total }
    
    def multiply(Object[] args) { BigDecimal total = 1; args.each { total *= (it ?: 0) }; return total }
    
      // don't do separate versions of division because Groovy method resolution is flakey,
      // but we do need to handle BigDecimal separately
    def divide(arg1, arg2) {
        // if either arg is null, or if denominator is 0, return null
        def result
        if (arg1 == null || arg2 == null) {
            result = null
        } else if (arg2 == 0) {
          result = null
        } else if (arg1 instanceof BigDecimal) {
          result = arg1.divide(arg2, MathContext.DECIMAL64)
        } else {
          result = arg1 / arg2
        }
        result
    }
}
