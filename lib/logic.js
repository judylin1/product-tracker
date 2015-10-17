module.exports = {
  categories: ['Bedroom', 'Den', 'Office', 'Kitchen', 'Entertainment', 'Garage', 'Electronics', 'Appliances', 'Furniture', 'Jewelry', 'Misc'],

  productCategories: function (categories, products) {
    var prod = products.reduce(function (end, product) {
      end[product._id.toString()] = product
      return end
    }, {})
    categories.forEach(function (category) {
      category.products = category.products.map(function (_id) {
        return prod[_id.toString()]
      })
    })
    return categories
  },

  userProd: function (products, users) {
    return products.map(function (product) {
      users.forEach(function (user) {
        if (user._id.toString() === product.userId.toString()) {
          product.user = user;
        }
      })
      return products
    })
  },

  check: function (cat) {
    return cat.filter(function (event) {
      if (event.trim() !== "") {
        return event
      }
    })
  },
}
