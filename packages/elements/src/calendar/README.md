# Calendar

```live(preview)
<ef-calendar></ef-calendar>
<ef-calendar range values="2020-04-01,2020-04-21"></ef-calendar>
<style>
ef-calendar {
  margin-right: 20px;
}
</style>
```

Calendar control allows switching of days, months and years.

Custom content can be added using the [footer slot](#adding-footer-content)

### Setting the date

The initial value of the calendar can be set using the value property. Value must be provided in `yyyy-MM-dd` format, for instance: `"2020-04-21"`.

```live
<ef-calendar value="2020-04-21"></ef-calendar>
```

```html
<ef-calendar value="2020-04-21"></ef-calendar>
```

### Defining the view

By default, the calendar will show the current month.
It can be customized by using `view` and it must be in `yyyy-dd` format, e.g. `"2020-04"`.

```live
<style>
  ef-calendar {
    margin-right: 20px;
  }
</style>

<ef-calendar></ef-calendar>
<ef-calendar view="2020-04"></ef-calendar>
```

```html
<ef-calendar view="2020-04"></ef-calendar>
```

### Defining min and max values

You can restrict the available date range by passing in min and max values.

```live
<style>
  ef-calendar {
    margin-right: 20px;
  }
</style>
<ef-calendar min="1990-01-05" view="1990-01"></ef-calendar>
<ef-calendar max="2100-12-25" view="2100-12"></ef-calendar>
```

```html
<ef-calendar min="1990-01-05" view="1990-01"></ef-calendar>
<ef-calendar max="2100-12-25" view="2100-12"></ef-calendar>
```

### Multiple select

You can switch the calendar to multiple select mode by setting `multiple`.

```live
<style>
  ef-calendar {
    margin-right: 20px;
  }
</style>
<ef-calendar multiple></ef-calendar>
<ef-calendar multiple values="2020-04-01,2020-04-11,2020-04-21"></ef-calendar>
```

```html
<ef-calendar multiple></ef-calendar>
<ef-calendar multiple values="2020-04-01,2020-04-11,2020-04-21"></ef-calendar>
```

### Range select

You can switch the calendar to range select mode by setting `range`. You cannot have multiple ranges.

```live
<style>
  ef-calendar {
    margin-right: 20px;
  }
</style>
<ef-calendar range></ef-calendar>
<ef-calendar range values="2020-04-01,2020-04-21"></ef-calendar>
```

```html
<ef-calendar range></ef-calendar>
<ef-calendar range values="2020-04-01,2020-04-21"></ef-calendar>
```

### Filtering dates

`ef-calendar` has two internal filtering options. One for enabling the weekdays only and another for only enabling the weekends.

These are basic filters. More complex ones can be added using the filter option.

```live
<style>
  ef-calendar {
    margin-right: 20px;
  }
</style>
<ef-calendar weekdays-only></ef-calendar>
<ef-calendar weekends-only></ef-calendar>
<ef-calendar id="custom-filter"></ef-calendar>
<script>
  var el = document.getElementById('custom-filter');
  el.filter = function (value) {
    var date = new Date(value);
    return date.getDate() % 2; // odd dates only
  };
</script>
```

```html
<ef-calendar weekdays-only></ef-calendar>
<ef-calendar weekends-only></ef-calendar>
<ef-calendar id="custom-filter"></ef-calendar>
<script>
  var el = document.getElementById('custom-filter');
  el.filter = function (value) {
    var date = new Date(value);
    return date.getDate() % 2; // odd dates only
  };
</script>
```

### Setting locale
By default the calendar uses system default locale (or US English if undefined). You can change the locale by setting [lang](https://www.w3.org/International/questions/qa-html-language-declarations) attribute either globally or locally.

The first day of the week is defined by the locale. You can override this by setting `first-day-of-week`.

```live
<style>
  ef-calendar {
    margin-right: 20px;
  }
</style>
<ef-calendar lang="th" value="2019-05-21"></ef-calendar>
<ef-calendar first-day-of-week="3" value="2019-05-21"></ef-calendar>
```

```html
<ef-calendar lang="th" value="2019-05-21"></ef-calendar>
<ef-calendar first-day-of-week="3" value="2019-05-21"></ef-calendar>
```

### Adding Footer Content

The calendar supports adding footer content. This can be used to give information about the date entry, or to provide additional controls like 'reset'.
```live
<style>
  div {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
</style>
<ef-calendar>
  <div slot="footer">
    <span>Hey there 👋</span>
    <a href="javascript:reset()">Reset</a>
  </div>
</ef-calendar>
<script>
  var el = document.querySelector('ef-calendar');
  function reset () {
    el.value = el.view = '';
  }
</script>
```

```html
<ef-calendar>
  <div slot="footer">
    <span>Hey there 👋</span>
    <a href="javascript:reset()">Reset</a>
  </div>
</ef-calendar>
```
