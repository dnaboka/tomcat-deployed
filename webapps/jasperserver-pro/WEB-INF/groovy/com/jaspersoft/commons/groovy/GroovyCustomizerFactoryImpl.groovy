/*
 * Copyright © 2005 - 2018 TIBCO Software Inc. All Rights Reserved. Confidential & Proprietary.
 */

package com.jaspersoft.commons.groovy

import groovy.lang.Script;
import groovy.transform.CompileStatic
import groovy.transform.TimedInterrupt

import org.codehaus.groovy.ast.expr.*
import org.codehaus.groovy.control.*
import org.codehaus.groovy.control.customizers.*
import org.codehaus.groovy.control.customizers.SecureASTCustomizer.ExpressionChecker

import com.jaspersoft.commons.dataset.expr.*

/**
 * The GroovyCustomizerFactory interface is used by the GroovyRunnerFactory to customize compilation of Groovy scripts in JRS.
 * Groovy scripts get run from the SQLGenerators, from domain security principalExpressions, 
 * and from DomEL expressions calling the "groovy()" function.
 * When a Groovy script is run, a GroovyRunner is created, and it will call the GroovyCustomizerFactory, if configured,
 * to get one or more CompilationCustomizer instances.
 * There are tons of ways to customize Groovy compilation; you can find many resources on the Internet, although it is a rather arcane subject.
 * 
 * This particular GroovyCustomizerFactory is itself written in Groovy, with the source copied to the JRS webapp, where it's
 * configured as a Spring bean and compiled on the fly. You could use Java code, but doing it this way makes it easier to configure.
 * It returns a single CompilationCustomizer which is a SecureASTCustomizer initialized with various restrictions on Groovy code.
 * 
 * The classes in receiversWhiteList are the only ones on which a method can be called. However, much Groovy code relies on resolving
 * methods at runtime, so in the AST many objects only have a type of Object.
 * For example, take a primcipalExpression in the Supermart domain security file:
 * 		
 * 		authentication.getPrincipal().getRoles().any{ it.getRoleName() in ['ROLE_ADMINISTRATOR','ROLE_HR'] }
 *
 * The return type of "authentication.getPrincipal()" is Object, but "authentication* itself is also seen as Object.
 * Object can't be on the receiver list or it will allow any method to run through dynamic resolution.
 * 
 * The approach taken currently is to allow Object calls if they are being called on "this". We have a base script class to which we add 
 * new convenience methods (see BaseGroovyScript.groovy), and we can create methods to wrap the code we want to allow to run.
 * In this case, we put the logic in a function called checkCurrentUserRoles, and change the principalExpression to this:
 *
 * 		checkCurrentUserRoles('ROLE_ADMINISTRATOR','ROLE_HR')
 * 
 * To implement other tests, additional methods can be added to BaseGroovyScript.groovy as needed. 		
 */
class GroovyCustomizerFactoryImpl implements GroovyCustomizerFactory {
	
	// we do our own whitelist testing in the expression checker; calls to "this" are OK but they are identified as type Object
	def receiversWhiteList = [ 
		'java.lang.Byte', 
		'java.lang.Character', 
		'java.lang.Short', 
		'java.lang.Integer', 
		'java.lang.Long', 
		'java.lang.Float', 
		'java.lang.Double', 
		'int',
		'java.lang.BigDecimal', 
		'java.lang.Math', 
		'java.util.Date', 
		'java.lang.Thread', 
		'java.util.Collection'
	]
	
	@Override
	CompilationCustomizer[] getGroovyCustomizers(boolean trusted, Binding binding, Class<Script> baseScriptClass) {
		def customizers = []
		// if not trusted script, add the sandbox
		if (! trusted) {
			def secure = new SecureASTCustomizer()
			// this sets properties on the SecureASTCustomizer (see its JavaDoc for more information)
			// the first line in the block is equivalent to calling "secure.setMethodDefinitionAllowed(false)"
			secure.with {
				methodDefinitionAllowed = false
				importsWhitelist = []
				staticImportsWhitelist = []
			}
			// The expression checker allows more fine-grained checking than the built-in checking of this customizer.
			// We allow references to "this" or to vars in the binding, but any other refs are checked against the whitelist of receiver classes.
			secure.addExpressionCheckers(new SandboxExpressionChecker(binding: binding, baseScriptClass: baseScriptClass))
			customizers << secure
		}
		// return customizers
		customizers as CompilationCustomizer[]
	}
	
	class SandboxExpressionChecker implements ExpressionChecker {
		def binding
		def baseScriptClass
		
		boolean isAuthorized(Expression expr) {
			def receiver
			def receiverTypeName
			def ok
			switch (expr) {
				// method pointer expressions not allowed, since they can allow use of arbitrary methods
				case MethodPointerExpression: 
					return false
				// Any of these expressions have a receiver instance or class; that is, the object on which the class is called.
				// We should obtain the receiver type, and also find whether the receiver is "this", which is OK.
				case PropertyExpression: 
					// println "prop ${expr.property.value} recv ${expr.objectExpression} recvtype ${expr.objectExpression.type.name}"
				case AttributeExpression:
				case MethodCallExpression:
					receiver = expr.objectExpression
					receiverTypeName = receiver.type.name
					break
				case StaticMethodCallExpression: 
					receiverTypeName = expr.ownerType.name
					break
				default:
					ok = true
					break
			}
			// look for receiver in expressions that we already checked; if receiver is OK, this is OK too
			// if receiver is a var, check known names
			if (receiver instanceof VariableExpression) {
				// calls on "this" are OK
				if (receiver.thisExpression) {
					if (baseScriptClass &&
						baseScriptClass.methods.find { it.clazz.name == baseScriptClass.name && it.name == expr.method.value }) {
						ok = true
					}
				// as are bound vars
				} else if (binding.variables.containsKey(receiver.name)) {
					ok = true
				}
			}
			// check the type against the white list
			if (receiverTypeName in receiversWhiteList) {
				ok = true
			}
			// if still not OK, do recursive check of some types of receiver, because props/method calls on allowed expressions are also allowed
			if (! ok) {
				switch (receiver) {
					case PropertyExpression: 
					case MethodCallExpression:
					case StaticMethodCallExpression: 
						if (isAuthorized(receiver)) {
							ok = true
						}
						break
				}
			}
			return ok
		}
	}
}
