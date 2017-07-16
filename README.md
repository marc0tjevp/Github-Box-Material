# GitHub-Box-Material
A GitHub repository widget made with MaterializeCSS

![alt text](https://github.com/marc0tjevp/github-box-material/raw/develop/preview.png "Preview")

## Description
GitHub-Box-Material is a little widget that gives you the posibility to show a repository on a webpage.

## Dependencies
This widget makes use of MaterializeCSS and Font Awesome.

## Usage
Include github-repos.js, github-repos.css in any page where you want to display a GitHub-Box.

Display a GitHub-Box:
```html
<a href="//github.com/marc0tjevp/United-GTK">United GTK</a>
```

Create a main object that receives a selector, for which element will be replaced with a GitHub-Box. The link should have this class:
```javascript
GHRepos.create('.gitbox')
```

You can also give it a surrounding to tag. This way all the links in it will become Github-Boxes:
```javascript
GHRepos.create('projects a')
```

## License
This is distributed under the terms of the GNU General Public License, version 2 or later.
