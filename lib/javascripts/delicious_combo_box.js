var DeliciousComboBox = Class.create({
  initialize: function(selectElement) {
    this.selectElement = selectElement
    this._createContainer()
    this._setupObservers()
  },

  _createContainer: function(){
    this.container = document.createElement('div')
    this.container.addClassName('deliciousComboBox')
    this.selectElement.insert({ after: this.container})
    this._createInputElement()
    this._createListElement()
  },

  _createInputElement: function() {
    this.combobox = document.createElement('input')
    this.combobox.writeAttribute({'type': 'text', 'class': 'deliciousComboInput'})
    this.container.insert({ bottom: this.combobox})
    this._stealSelectName()
    this._hideSelectElement()
  },

  _createListElement: function() {
    this.listContainer = $(document.createElement('div'))
    this.listContainer.addClassName('deliciousComboList')
    this.container.insert({ bottom: this.listContainer})

    this.listContainer.absolutize()
    this.listContainer.clonePosition(this.combobox, 
      {setWidth: false, setHeight: false, offsetTop: this.combobox.getHeight()})
    this.listContainer.setStyle({ 'width': '157px', 'height': 'auto' })
    this.listContainer.hide()

    this.listItems = document.createElement('ul')
    this.listContainer.appendChild(this.listItems)
  },

  _updateListItems: function() {
    this.listItems.innerHTML = ''
    var optionItemTemplate = new Template('<li value="#{value}">#{content}</li>')

    this.selectElement.descendants().each( function(option) {
      this.listItems.insert({ bottom: optionItemTemplate.evaluate({value: option.value, content: option.innerHTML})})
    }.bind(this))
  },

  _stealSelectName: function() {
    this.combobox.writeAttribute({'name': this.selectElement.name})
    this.selectElement.removeAttribute('name')
  },

  _hideSelectElement: function() {
    this.selectElement.hide()
  },

  _setupObservers: function() {
    this.listItems.observe('click', this._onClick.bind(this))
    this.combobox.observe('focus', this._onFocus.bind(this))
    this.combobox.observe('blur', this._onBlur.bind(this))
  },

  _onFocus: function() {
    this.listContainer.show()
    this._updateListItems()
  },

  _onBlur: function() {
    setTimeout(this.listContainer.hide.bind(this.listContainer), 200)
  },

  _onClick: function(evt) {
    this.combobox.value = evt.findElement('li').innerHTML
  }
})
