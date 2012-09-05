# jQuery Transition Events Plugin

CSS Transition allows to write simple animation directly in CSS. It’s simpler,
faster and cleaner, that JavaScript animation by `jQuery.fn.animate`.
But sometimes we need good old complete callback in JavaScript for
CSS Transitions animation (for example, if our animation isn’t so simple).

This jQuery plugin allows to set listeners to [CSS Transitions] animation end or
specific part:

CSS with transitions:
```css
.slider {
    transition: left 600ms;
    left: 0;
    }
    .slider.to-right {
        left: -100px;
        }

.fliper {
    transition: transform 600ms;
    transform: rotateY(0);
    }
    .fliper.rotate {
        transform: rotateY(180deg);
        }
```

JavaScript with callbacks:
```js
$('.slider').addClass('to-right').transitionEnd(function () {
    playVideo( $(this).find('.right-part').find('video') );
});

$('.fliper').addClass('rotate'),transitionAt(0.5, function () {
    // Note, that we do double check for class, not just call `toggle`,
    // because `transitionAt` will be fired even if transition will be canceled.
    $(this).find('.backface').toggle($(this).hasClass('rotate'));
});
```

Plugin requires jQuery 1.8 or higher.

Sponsored by [Evil Martians].

[CSS Transitions]: https://developer.mozilla.org/en-US/docs/CSS/Using_CSS_transitions
[Evil Martians]:   http://evilmartians.com/

## $.fn.transitionEnd

Modern browsers have `transitionend` event. But some old browsers don’t support
CSS Transitions (and this event), and others require vendor prefix for
event name.

This plugin adds syntax sugar and hides vendor prefix problem from you.
If browser doesn’t have support, callbacks will be called immediately
(because there is no animation).

If transition is set for several properties, `$.fn.transitionEnd` will execute
callback on every property. For example:

```css
.car {
    transition-property: top, left;
    transition-duration: 1s,  4s;
    transition-delay:    1s;
    }
```

```js
$('.car').addClass('at-home').transitionEnd(function (e) {
    console.log(e.propertyName + ' ' + e.elapsedTime);
});
```

This code will print `"top 1"` and `"left 4"`.

Note, if transition is canceled before finishing (for example, you add
transition to hover effect, and object looses hover, before transition
will ends), `$.fn.transitionEnd` won’t execute callback.

## $.fn.transitionAt

Also plugin has additional `$.fn.transitionAt` function to set callback
to some part of transition (for example in the middle of animation, to hide
backface on rotate animation). Callback will be called after
`delay + (durationPart * duration)`.

If transition is set for several properties, `$.fn.transitionEnd` will execute
callback on every property.

Note, that `transitionAt` callback will be fired even if transition is canceled
(because JavaScript can’t know that).

## Event object

Callbacks get object with properties:
* `type` – event name. For `transitionend` event it will be often have
   vendor prefix. For `$.fn.transitionAt` it will be `transitionat`.
* `currentTarget` – DOM node with CSS transition.
* `propertyName` – CSS property name, which has transition. it will be empty,
  if CSS Transitions aren’t supported.
* `elapsedTime` – number of seconds the transition had been running at the time
  the event fired. This value isn't affected by the value of `transition-delay`.
  It will be zero, if CSS Transitions isn’t supported.

If CSS Transition is supported, `$.fn.transitionEnd` will send original browser
event to callback (with this properties too). If you use `$.fn.transitionAt` or
there is no CSS Transitions support, callback will receive simple object
with just these 4 properties.

## Extra

Free additional present from plugin: you can check CSS Transition support:

```js
if ( $.TransitionEvents.isSupported() ) {
    // CSS Transitions is supported
}
```

## Installing

### Ruby on Rails

For Ruby on Rails you can use gem for Assets Pipeline.

1. Add `transition_events_js` gem to `Gemfile`:

   ```ruby
   gem "transition_events_js"
   ```

2. Install gems:

   ```sh
   bundle install
   ```

3. Include plugin to your `application.js.coffee`:

   ```coffee
   #= require transition-events
   ```

### Others

If you don’t use any assets packaging manager (that’s very bad idea), you can use
already minified version of the library.
Take it from: <https://github.com/ai/transition-events/downloads>.

## Contributing

Open `test.html` in repository to run intergration tests.
