# Form-validation
>Js library which check html atrributes and create nice validation
## Table of contents
* [Use](#use)
* [Requirements](#requirements)
* [Getting started](#getting-started)
* [Options](#options)
## Use
* [jQuery v1.9.1+](https://jquery.com/)
* [FL tooltip](https://github.com/Ajjya/fltooltip)
## Requirements
* [jQuery v1.9.1+](https://jquery.com/)
* [FL tooltip](https://github.com/Ajjya/fltooltip)
## Getting started
### Quick start
Four quick start options are available:
* [Download the latest release](https://github.com/Ajjya/Form-validation/archive/master.zip)
* Clone the repository: git clone [Form-validation](https://github.com/Ajjya/Form-validation.git)
### Installation
Include files:
```html
<link rel="stylesheet" href="/path/to/form-validation.css">
<script src="/path/to/jquery.js"></script><!-- jQuery is required -->
<script src="/path/to/fltooltip.js"></script><!-- FlTooltip is required -->
<script src="/path/to/form-validation.js"></script>
```
### Usage
#### Activation File Library
In footer (or in default js file) add next code.
```html
<script type="text/javascript">
	var formErr = new fe(document.getElementById('contact-form'), options);
</script>
```
_Where:_
_options - object with options_
### Options
_You can translate ln/en.json, create needed language and add it to ln folder.
#### fe_root: '/url/to/form-error-folder';
Path to library.
#### language: 'ln'
Default: 'en'.
#### show_tooltip: boolean
Shows errors above form elements. Default: true.
#### reactive_form: boolean 
Shows error on each form element after blur. Default: true.

**Example**
```js
	if(document.getElementById('contact-form')){
		formErr = new fe(document.getElementById('contact-form'), 
			{
				fe_root: '/url/to/form-error-folder',
				show_tooltip: false,
				reactive_form: true
			}
		);
	} 
```
## Advanced usage
###Using custom names of fields
You can use attr fe-name for customizing messages. If fe-name is not specified library uses attr name.
```html
	<input type="text" name="user_name" id="user_name" placeholder="Full Name" value="" fe-name="Full Name" required>
	<input type="text" name="phone" id="phone" placeholder="Mobile Number" value="" fe-name="Mobile Number" required>
```
###Using functions in any time and place you need
#### validate: boolean
validates you fields, no arguments, returns true or false according to validation
###Using events
#### fe_ln_loaded - then language loaded succesfull
#### fe_error - then validation error is happend
#### fe_suc - then validation was succesfull
