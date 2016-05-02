function get (query, callback) {
	let res = $.ajax({url:'/data/get',data:query}).success(function(data) { callback(data) })
}

function view(category,mountNode) {
	get({by:'category'}, function(data) {
		// console.log(data[category])
		return $(mountNode).html(`
			<table>
				<tr>
					<th>${category.toUpperCase()}</th>
				</tr>
				<tr>
					<td>${data[category].join().replace(/\,/g,'</td></tr><tr><td>')}
			</table>`)
	})
}