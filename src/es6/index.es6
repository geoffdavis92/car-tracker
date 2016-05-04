// index

console.log('index')

$('.data-view').each(function(i,el) {
	let category = $(el).attr('id'),
		mountNode = `#${$(el).attr('id')}`
	view(category,mountNode)
})

setTimeout(function() {
	$('.data-view td').each(function(i,el) {
		// console.log(el)
		if ( $(el).text().search(/\-/g) >= 0) {
			$(el).addClass('negative')
		}
	})
}, 25)

get('/car/category',{},(data) => {
	for (cat in data) {
		if (cat !== 'date') {
			for(let i=0; i<data[cat].length; i++) {
				data[cat][i] = parseFloat(data[cat][i].replace(/\$/g,''))
			}
			let arr = data[cat].sort((a,b) => a - b),
				o = cat === 'fill_cost' || cat === 'price_gal' ?
					{
						max: `$${arr[arr.length-1]}`,
						min: `$${arr[0]}0`
					} 
				: 
					{
						max: arr[arr.length-1].toString(),
						min:arr[0].toString()
					}
			// console.log('sorted ',cat,' : ',arr)
			// console.log(cat,' : ',o)
			$(`.data-view#${cat} td`).each(function(i,el) {
				if ($(el).text() === o.max) {
					$(el).addClass('max')
					return
				} else if ($(el).text() === o.min) {
					$(el).addClass('min')
					return
				}
			})
		}
	}
})