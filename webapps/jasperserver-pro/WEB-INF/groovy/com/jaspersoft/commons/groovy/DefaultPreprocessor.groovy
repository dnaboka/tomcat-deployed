/*
 * Copyright © 2005 - 2018 TIBCO Software Inc. All Rights Reserved. Confidential & Proprietary.
 */

package com.jaspersoft.commons.groovy

import com.jaspersoft.commons.dataset.expr.*

/**
 * ExpressionWalker has been enhanced to have a "preprocessor" property of type ExpressionTransformer.
 * The preprocessor applies any desired modifications before walking the expression.
 * This implementation is used as a preprocessor for GroovyGenerator and SQLGenerator.
 * By default, if it sees a call to the "groovy()" function, it will call a sandboxed GroovyRunner to evaluate it.
 * UPDATE: made this configurable because this change in how "groovy()" operates may have subtle side effects in 
 * how the SQL and Groovy gets generated, so the default will be to leave it alone so that it works as before.
 * 
 * @author btinsman
 *
 */
class DefaultPreprocessor extends ExpressionTransformerImpl {
	GroovyRunnerFactory groovyRunnerFactory
	boolean preprocessGroovy = false
	
    DefaultPreprocessor() {
        super(null)
    }
    
    ExpressionEvaluator getEval() {
        expressionEvaluator
    }
    
	def p(Object[] args) { System.out.println(args?.join(" ")) }
	/**
	 * Transform "groovy(groovyExprString)" by calling a GroovyRunner to run it.
	 * This will do sandboxing.
	 */
	@Override
	Expression getOperator(Operator expr) {
		// pre-evaluate "groovy" if enabled
		def doPreEval = preprocessGroovy && expr.getDefinition().getName().equals("groovy")
		if (doPreEval) {
			// "groovy" should only have a single string literal argument
			if (expr.getOperandCount() != 1 ||
				! (expr.getOperand(0) instanceof Literal) ||
				! (expr.getOperand(0).javaType == "java.lang.String")) {
				throw new IllegalArgumentException("groovy() can only have a single argument which is a string literal: $expr")
			}
			def result = groovyRunnerFactory.evaluate(expr.getOperand(0).value)
			eval.getLiteral(result)
	    } else {
			super.getOperator(expr);
	    }
	}
}
