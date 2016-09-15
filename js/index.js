'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var Router = ReactRouter.Router;
var Route = ReactRouter.Route;
var IndexRoute = ReactRouter.IndexRoute;
var Link = ReactRouter.Link;
var hashHistory = ReactRouter.hashHistory;

var initialRecipes = [{
  name: '',
  nameLink: '',
  img: '',
  ingredients: [''],
  source: ''
}, {
  name: '',
  nameLink: '',
  ingredients: [''],
  img: '',
  source: ''
}, {
  name: '',
  nameLink: '',
  ingredients: [''],
  img: '',
  source: ''
}];

if (window.localStorage) {
  if (!window.localStorage.recipeBox) {
    window.localStorage.setItem('recipeBox', JSON.stringify(initialRecipes));
  }
}

var recipeStore = JSON.parse(window.localStorage.getItem('recipeBox'));

var RecipeRouter = React.createClass({
  displayName: 'RecipeRouter',

  getInitialState: function getInitialState() {
    return {
      formClass: 'hidden',
      recipes: recipeStore,
      alertMsg: 'I\'m an alert!',
      alertMsgClass: 'hidden'
    };
  },
  showForm: function showForm(e) {
    e.preventDefault();
    this.setState({
      formClass: ''
    });
  },
  closeForm: function closeForm(e) {
    this.setState({
      formClass: 'hidden'
    });
    e.preventDefault();
  },
  alertMessage: function alertMessage(msg) {
    var _this = this;

    this.setState({
      alertMsg: msg,
      alertMsgClass: ''
    });

    setTimeout(function () {
      _this.setState({
        alertMsgClass: 'hidden'
      });
    }, 1500);
  },
  addRecipe: function addRecipe(e) {
    e.preventDefault();
    var newName = document.getElementById('new-title').value;
    var newSource = document.getElementById('new-source').value;
    var newImg = document.getElementById('new-img').value;
    var newIngredients = document.getElementById('new-ingredients').value;

    if (!newName || !newSource || !newIngredients) {
      this.setState({
        formClass: 'hidden'
      });
      return;
    }

    newIngredients = newIngredients.split(',');

    var newRecipe = {
      name: newName,
      nameLink: newName.replace(' ', ''),
      source: newSource,
      img: newImg,
      ingredients: newIngredients      
    };

    document.getElementById('new-title').value = "";
    document.getElementById('new-source').value = "";
    document.getElementById('new-img').value = "";
    document.getElementById('new-ingredients').value = "";

    var newList = [];
    this.state.recipes.forEach(function (recipe) {
      newList.push(recipe);
    });

    newList.push(newRecipe);

    window.localStorage.setItem('recipeBox', JSON.stringify(newList));

    this.setState({
      formClass: 'hidden',
      recipes: newList
    });

    this.alertMessage('Recipe added!');
  },
  deleteRecipe: function deleteRecipe() {
    // find which recipe isn't hidden and save its recipeName   
    var recipeContainer = document.getElementsByClassName('fullsize-recipe-container')[0];
    var fullRecipes = recipeContainer.children;
    var recipeName = "";
    var removeIndex = undefined;

    Array.prototype.forEach.call(fullRecipes, function (recipe, index) {
      if (recipe.className !== 'hidden') {
        // below check only for deleting the read-only recipe
        if (recipe.id.indexOf('completeRecipe') > -1) {
          recipeName = recipe.id.replace('completeRecipe', '');
          removeIndex = index;
        }
      }
    });

    var newList = [];

    newList = this.state.recipes.filter(function (recipe, index) {
      return index !== removeIndex;
    });

    window.localStorage.setItem('recipeBox', JSON.stringify(newList));

    this.setState({
      recipes: newList
    });

    this.alertMessage('Recipe deleted!');
  },
  editRecipe: function editRecipe() {
    var recipeContainer = document.getElementsByClassName('fullsize-recipe-container')[0];
    var fullRecipes = recipeContainer.children;
    var recipeName = "";
    var editIndex = undefined;

    Array.prototype.forEach.call(fullRecipes, function (recipe) {
      if (recipe.className !== 'hidden') {
        recipeName = recipe.id.replace('editableRecipe', '');
      }
    });

    for (var i = 0; i < this.state.recipes.length; i++) {
      if (this.state.recipes[i].name === recipeName) {
        editIndex = i;
      }
    }

    //let changeRecipe = this.state.recipes[editIndex];

    var changeName = document.getElementById('change-name' + recipeName).value;
    var changeSource = document.getElementById('change-source' + recipeName).value;
    var changeImg = document.getElementById('change-img' + recipeName).value;
    var changeIngredients = document.getElementById('change-ingredients' + recipeName).value;

    var newNameLink = changeName.replace(' ', '');

    var editedRecipe = {
      name: changeName,
      nameLink: newNameLink,
      ingredients: changeIngredients.split(','),
      img: changeImg,
      source: changeSource
    };

    var newRecipes = [];

    for (var j = 0; j < this.state.recipes.length; j++) {
      if (j !== editIndex) {
        newRecipes.push(this.state.recipes[j]);
      } else {
        newRecipes.push(editedRecipe);
      }
    }

    window.localStorage.setItem('recipeBox', JSON.stringify(newRecipes));

    this.setState({
      recipes: newRecipes
    });

    this.alertMessage('Changes saved!');
  },
  createElement: function createElement(Component, props) {
    return React.createElement(Component, _extends({ recipes: this.state.recipes, 'delete': this.deleteRecipe, edit: this.editRecipe }, props));
  },
  render: function render() {
    return React.createElement(
      'div',
      null,
      React.createElement(
        Router,
        { createElement: this.createElement, history: hashHistory },
        React.createElement(
          Route,
          { path: '/', component: wrapComponent(TopBar, { showForm: this.showForm }) },
          React.createElement(IndexRoute, { component: RecipeThumbs }),
          React.createElement(Route, { path: '/recipeList', component: RecipeList }),
          React.createElement(Route, { path: '/recipeFull/:recipeName', component: RecipeFullList })
        )
      ),
      React.createElement(Form, { submitEvent: this.addRecipe, isShown: this.state.formClass, closeEvent: this.closeForm }),
      React.createElement(QuickAlert, { isShown: this.state.alertMsgClass, message: this.state.alertMsg })
    );
  }
});

var wrapComponent = function wrapComponent(Component, props) {
  return React.createClass({
    render: function render() {
      return React.createElement(Component, props, this.props.children);
    }
  });
};

var TopBar = React.createClass({
  displayName: 'TopBar',

  getInitialState: function getInitialState() {
    return {
      iconName: 'fa fa-list-ul'
    };
  },
  toggleViews: function toggleViews() {
    var newIcon = this.state.iconName === 'fa fa-th' ? 'fa fa-list-ul' : 'fa fa-th';
    this.setState({
      iconName: newIcon
    });
  },
  render: function render() {
    var otherView = this.state.iconName === 'fa fa-list-ul' ? '/recipeList' : '/';
    return React.createElement(
      'div',
      null,
      React.createElement(
        'div',
        { className: 'header' },
        React.createElement(
          'div',
          null,
          React.createElement('i', { className: 'fa fa-cutlery' }),
          React.createElement(
            'span',
            { className: 'head-title' },
            'Salt & Pepper'
          ),
          React.createElement('i', { className: 'fa fa-spoon' })
        ),
        React.createElement(
          'div',
          { className: 'btn-container' },
          React.createElement(
            Link,
            { className: 'btn-link', to: otherView, onClick: this.toggleViews },
            React.createElement('i', { id: 'switch-view-icon', className: this.state.iconName })
          ),
          React.createElement(Button, { id: 'add-btn', type: 'button', text: 'add recipe', clickEvent: this.props.showForm })
        )
      ),
      this.props.children
    );
  }
});

function QuickAlert(props) {
  var currClass = props.isShown + ' quick-alert';
  return React.createElement(
    'div',
    { className: currClass },
    React.createElement(
      'div',
      { className: 'alert-inside' },
      props.message
    )
  );
}

var RecipeThumbs = React.createClass({
  displayName: 'RecipeThumbs',

  render: function render() {
    var thumbList = this.props.recipes.map(function (recipe, index) {
      var key = 'thumb' + index;
      return React.createElement(
        'div',
        { className: 'recipe', key: key },
        React.createElement(Recipe, { data: recipe })
      );
    }.bind(this));

    return React.createElement(
      'ul',
      { className: 'recipe-container' },
      thumbList
    );
  }
});

function RecipeList(props) {
  var nameList = props.recipes.map(function (recipe, index) {
    var redirect = '/recipeFull/' + recipe.nameLink;
    var key = 'nameOnly' + index;
    return React.createElement(
      'li',
      { key: key },
      React.createElement(
        Link,
        { className: 'nameLink', to: redirect },
        recipe.name
      )
    );
  });

  return React.createElement(
    'ul',
    { className: 'nameList' },
    nameList
  );
}

function Recipe(props) {
  var redirect = 'recipeFull/' + props.data.nameLink;
  return React.createElement(
    'li',
    null,
    React.createElement(
      Link,
      { to: redirect },
      React.createElement(
        'div',
        { className: 'pic' },
        React.createElement('img', { src: props.data.img, alt: props.data.name })
      ),
      React.createElement(
        'div',
        { className: 'title' },
        props.data.name
      )
    )
  );
}

var RecipeFullList = React.createClass({
  displayName: 'RecipeFullList',

  contextTypes: {
    router: React.PropTypes.object,
    location: React.PropTypes.object
  },
  render: function render() {
    var recipeName = this.context.location.pathname.replace('/recipeFull/', '').replace('%20', ' ');
    var fullList = this.props.recipes.map(function (recipe, index) {
      var keyFull = 'recipeFull' + index;
      var showClass = recipeName === recipe.nameLink ? '' : 'hidden';

      return React.createElement(RecipeFull, { 'delete': this.props.delete, close: this.context.router.goBack, key: keyFull, data: recipe, show: showClass, edit: this.props.edit });
    }.bind(this));

    var editList = this.props.recipes.map(function (recipe, index) {
      var keyFull = 'editFull' + index;
      var linkString = 'edit' + recipe.nameLink;
      var showClass = recipeName === linkString ? '' : 'hidden';

      return React.createElement(EditableRecipeFull, { close: this.context.router.goBack, key: keyFull, data: recipe, show: showClass, edit: this.props.edit });
    }.bind(this));

    return React.createElement(
      'ul',
      { className: 'fullsize-recipe-container' },
      fullList,
      editList
    );
  }
});

var RecipeFull = React.createClass({
  displayName: 'RecipeFull',

  contextTypes: {
    router: React.PropTypes.object,
    location: React.PropTypes.object
  },
  render: function render() {
    var id = 'completeRecipe' + this.props.data.name;
    var editLink = '/recipeFull/edit' + this.props.data.nameLink;
    var returnView = document.getElementById('switch-view-icon').className;
    var backLink = returnView === 'fa fa-list-ul' ? '/' : 'recipeList/';

    return React.createElement(
      'li',
      { className: this.props.show, id: id },
      React.createElement(
        'a',
        { href: this.props.data.source, target: '_blank', className: 'pic-full' },
        React.createElement('img', { src: this.props.data.img, alt: this.props.data.name })
      ),
      React.createElement(
        'div',
        { className: 'details-full' },
        React.createElement(LinkButton, { btnClass: 'close', redirect: backLink, text: 'X' }),
        React.createElement(
          'div',
          { className: 'title-full title' },
          this.props.data.name
        ),
        React.createElement(
          'div',
          { className: 'link-row' },
          React.createElement(
            'a',
            { href: this.props.data.source, target: '_blank', className: 'link btn' },
            'source'
          ),
          React.createElement(LinkButton, { text: 'edit', redirect: editLink }),
          React.createElement(LinkButton, { clickEvent: this.props.delete, redirect: '/', text: 'delete' })
        ),
        React.createElement(IngredientsList, { recipe: this.props.data.name, ingredients: this.props.data.ingredients })
      )
    );
  }
});

var EditableRecipeFull = React.createClass({
  displayName: 'EditableRecipeFull',

  getInitialState: function getInitialState() {
    // this doesn't work unless there's a change. 'x' button doesn't go back
    return {
      redirect: ''
    };
  },
  nameChange: function nameChange() {
    var newName = document.getElementById('change-name' + this.props.data.name).value.replace(' ', '');

    this.setState({
      redirect: 'recipeFull/' + newName
    }, function () {
      console.log(this.state.redirect);
    });
  },
  contextTypes: {
    router: React.PropTypes.object,
    location: React.PropTypes.object
  },
  render: function render() {
    var id = 'editableRecipe' + this.props.data.name;
    var changeName = 'change-name' + this.props.data.name;
    var changeIng = 'change-ingredients' + this.props.data.name;
    var changeImg = 'change-img' + this.props.data.name;
    var changeSource = 'change-source' + this.props.data.name;

    var goBack = this.state.redirect === '' ? 'recipeFull/' + this.props.data.nameLink : this.state.redirect;

    return React.createElement(
      'li',
      { className: this.props.show, id: id },
      React.createElement(
        'a',
        { href: this.props.data.source, target: '_blank', className: 'pic-full' },
        React.createElement('img', { src: this.props.data.img, alt: this.props.data.name })
      ),
      React.createElement(
        'div',
        { className: 'edit-details-full' },
        React.createElement(LinkButton, { redirect: goBack, text: 'X', btnClass: 'close' }),
        React.createElement(
          'div',
          { className: 'title-full title' },
          'Edit ',
          this.props.data.name
        ),
        React.createElement(
          'div',
          { className: 'form-div' },
          React.createElement(
            'div',
            { className: 'new-inputs' },
            React.createElement(
              'label',
              { htmlFor: 'change-name', className: 'change-subtitle' },
              'New Name'
            ),
            React.createElement('input', { id: changeName, name: 'change-name', onChange: this.nameChange, defaultValue: this.props.data.name }),
            React.createElement(
              'label',
              { htmlFor: 'change-ingredients', className: 'change-subtitle' },
              'New Ingredients'
            ),
            React.createElement('input', { name: 'change-ingredients', id: changeIng, defaultValue: this.props.data.ingredients.toString() }),
            React.createElement(
              'label',
              { htmlFor: 'change-img', className: 'change-subtitle' },
              'New Image Url'
            ),
            React.createElement('input', { name: 'change-img', id: changeImg, defaultValue: this.props.data.img }),
            React.createElement(
              'label',
              { htmlFor: 'change-source', className: 'change-subtitle' },
              'New Recipe Source'
            ),
            React.createElement('input', { name: 'change-source', id: changeSource, defaultValue: this.props.data.source }),
            React.createElement(LinkButton, { btnClass: 'link', clickEvent: this.props.edit, redirect: goBack, text: 'submit changes' })
          )
        )
      )
    );
  }
});

function IngredientsList(props) {
  var ingList = props.ingredients.map(function (item, index) {
    var key = props.recipe + 'Ingredient' + index;
    return React.createElement(
      'li',
      { key: key },
      item
    );
  });
  return React.createElement(
    'div',
    { className: 'ingredients-full' },
    React.createElement(
      'h3',
      null,
      'Ingredients'
    ),
    React.createElement(
      'ul',
      null,
      ingList
    )
  );
}

var Form = React.createClass({
  displayName: 'Form',

  render: function render() {
    var formClass = 'add-form ' + this.props.isShown;
    return React.createElement(
      'form',
      { onSubmit: this.props.submitEvent, id: 'recipe-form', className: formClass },
      React.createElement(
        'div',
        { className: 'form-inside' },
        React.createElement(
          'h2',
          null,
          React.createElement(
            'div',
            null,
            'add new recipe'
          ),
          React.createElement(Button, { text: 'x', 'class': 'close btn', type: 'button', clickEvent: this.props.closeEvent })
        ),
        React.createElement('input', { id: 'new-title', type: 'text', placeholder: 'recipe title' }),
        React.createElement('input', { id: 'new-source', type: 'text', placeholder: 'recipe source' }),
        React.createElement('input', { id: 'new-img', type: 'text', placeholder: 'recipe picture' }),
        React.createElement('input', { id: 'new-ingredients', type: 'text', placeholder: 'enter ingredients, separated by a comma' }),
        React.createElement('input', { id: 'new-ingredients', type: 'text', placeholder: 'enter processes, separated by a comma' }),
        React.createElement(Button, { clickEvent: this.submit, type: 'submit', text: 'add' })
      )
    );
  }
});

function Button(props) {
  // props.type should only be 'submit' or 'button'
  var newClass = props.class ? props.class : 'btn';
  return React.createElement('input', { type: props.type, className: newClass, onClick: props.clickEvent, value: props.text });
}

var LinkButton = React.createClass({
  displayName: 'LinkButton',

  getDefaultProps: function getDefaultProps() {
    clickEvent: (function () {});
  },
  render: function render() {
    var newClass = this.props.btnClass ? 'btn ' + this.props.btnClass : 'btn';
    return React.createElement(
      Link,
      { className: newClass, onClick: this.props.clickEvent, to: this.props.redirect },
      this.props.text
    );
  }
});

ReactDOM.render(React.createElement(RecipeRouter, null), document.getElementById('app'));