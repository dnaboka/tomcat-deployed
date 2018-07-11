<%--
  ~ Copyright © 2005 - 2018 TIBCO Software Inc. All Rights Reserved. Confidential & Proprietary.
  --%>

<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/functions" prefix="fn"%>

<script id="adhocFilterState" type="text/javascript">
    // ${sessionScope.XSS_NONCE} do not remove
    localContext.numberOfExistingFilters = ${fn:length(viewModel.existingFilters)};
    //need to comment this out because of bug 24053
    //Because in other case during calling adhocDesigner.updateBase this script will evaluated (with incorrect data)
    //AFTER evaluating of baseState script where undoModeNames has correct value.
    //localContext.undoModeNames = "${viewModel.undoModeNames}".split(", ");
</script>

<%--
 HACK to fix bug 22529 - somewhy in IE <script id="adhocFilterState"> tag is not evaluated on AJAX request
 possibly due to compatibility mode.
 --%>
<textarea class="hidden" style="display:none" name="_evalScript">
    localContext.numberOfExistingFilters = ${fn:length(viewModel.existingFilters)};
    localContext.undoModeNames = "${viewModel.undoModeNames}".split(", ");
</textarea>