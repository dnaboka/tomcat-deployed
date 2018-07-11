<%--
  ~ Copyright © 2005 - 2018 TIBCO Software Inc. All Rights Reserved. Confidential & Proprietary.
  --%>

<tbody id="tableDetails" class="copyTo">
{{ var totalsMessage = '<spring:message code="ADH_088_TABLE_TOTALS" javaScriptEscape="true"/>';}}
{{ _.each(partial.table.flattenedData, function(member, index) { }}
		{{ if (member.isGroupMember) { }}
			{{localContext.state.table._oddIndex = 0;}}<%-- reset odd/even counter in case of group --%>
			<!-- START: Group -->
			{{ if (member.isFooter && partial.table.showTableTotals) { }}
			<tr id="{{-member.id}}"
				class="{{-member.rowClass}} memberSummaries"
				data-index="{{-index}}"
				data-value="{{- member.formattedValue }}"
				data-mask="{{-member.group.mask}}"
				data-type="{{-member.group.numericType}}"
				data-fieldDisplay="{{- member.group.defaultDisplayName }}"
				data-label="{{-member.group.currentDisplayName}}"
				data-fieldName="{{-member.group.fieldName}}">
				{{ _.each(member.groupSummaryRow.members, function(footerCell, index) { }}
					{{ if (index === 0) { }}
					<td class="value">{{- formatString(totalsMessage, member.formattedValue) }}</td>
					{{ } else { }}
					<td class="value {{ footerCell.isNumeric ? print('numeric') : print('') }}">{{- footerCell.formattedContent }}</td>
					{{ } }}
				{{ }); }}
			</tr>
			{{ } else { }}
			<tr class="placeholder member labels">
    				<td class="label" colspan="{{ print(columns.length); }}">
    					<span id="{{-member.id}}" class="{{-member.rowClass}} placeholder member labels" >{{- member.formattedValue }}</span>
    				</td>
    			</tr>
			{{ } }}
			<!-- END: Group -->
		{{ } }}

		{{ if (member.isRow && partial.table.showTableDetails) { }}
			{{ if (partial.table.hasColumns) { }}
			<tr class="record {{- localContext.state.table._oddIndex % 2 == 0 ? 'even' : 'odd'}}">
    				{{ _.each(member.members, function(detailCell, index) { }}
    				<td class="value {{ detailCell.isNumeric ? print('numeric') : print(''); }}">
    					<span class="wrap">{{ (!detailCell.formattedContent ? print('&nbsp;') : print(_.xssEscape(detailCell.formattedContent))) }}</span>
    				</td>
    				{{ }); }}
    			</tr>
			{{localContext.state.table._oddIndex += 1;}}
			{{ } }}
		{{ } }}
	{{ }); }}
	<!-- END: Group and Rows-->

	<!-- START: Summary Row -->
	{{ if (partial.table.hasSummaryRow) { }}
	<tr id="grandSummaryRow" class="grand columnSummaries stripe">
    		{{ _.each(partial.table.summaryRow.members, function(summaryCell, index) { }}
    			{{ if (summaryCell.isEmpty) { }}
    			<td id="grandSummaryCell_{{-index}}"
    				data-summaryIndex="{{-index}}"
    				data-fieldName="{{-partial.table.columns[index].fieldName}}"
    				class="value"></td>
    			{{ } else { }}
    			<td id="grandSummaryCell_{{-index}}"
    				class="value {{ summaryCell.isNumeric ? print('numeric') : print(''); }}"
    				data-summaryIndex="{{-index}}"
    				data-fieldName="{{-partial.table.columns[index].fieldName}}"
    				data-name="{{-partial.table.columns[index].summaryFunction}}">{{- summaryCell.formattedContent }}
    			</td>
    			{{ } }}
    		{{ }); }}
    	</tr>
	{{ } }}
	<!-- END: Summary Row -->

	<!-- START: EOF file test -->
	{{ if (endOfFile) { }}
	    <tr id="endOfFileRow"></tr>
	{{ } }}
	<!-- END: EOF file test -->
</tbody>
