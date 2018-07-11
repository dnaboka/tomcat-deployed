/*
 * Copyright © 2005 - 2018 TIBCO Software Inc. All Rights Reserved. Confidential & Proprietary.
 */

package groovy_script

import org.springframework.security.core.context.SecurityContextHolder
import static java.lang.Math.*

/**
 * This class serves as the base class for any Groovy scripts that get run.
 * It provides a convenient way to expand the capabilities of scripts by adding methods.
 * If you are sandboxing and need to provide functionality to domain security Groovy calls,
 * you can implement the specific functionality here and call it from your principalExpression.
 *
 */
abstract class BaseGroovyScript extends Script {
	
	// return true if the current user holds a role that matches any one of the role names passed as arguments.
	// For example, this code would return true if the current user is either ROLE_ADMIN or ROLE_SUPERUSER:
	//     checkCurrentUserRoles('ROLE_ADMIN', 'ROLE_SUPERUSER')
	boolean checkCurrentUserRoles(String... roles) {
		SecurityContextHolder.context.authentication?.principal.roles.any{ it.roleName in roles }
	}
	
	def currentUser() {
		SecurityContextHolder.context.authentication?.principal
	}
}