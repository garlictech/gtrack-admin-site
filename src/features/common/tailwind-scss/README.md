# Tailwind SCSS

## @apply

```
@include @apply('w-100', 'bg-red');
```

## @media-breakpoint

Add a media query

```
@include media-breakpoint(xs) {
  width: 100%;
}
```

## @generate-breakpoint-prefixes

This mixin generates the prefixed classes.

```
@include generate-breakpoint-prefixes('w-full') {
  width: 100%;
}
```

This will generate the following code:

```

@media (min-width: 576px) {
  .sm:w-100 {
    width: 100%;
  }
}

@media (min-width: 768px) {
  .md:w-100 {
    width: 100%;
  }
}
```

## @add-utilities

This mixin adds the new utility class to the utilities and generates the css classes. If the second parameter is true also generates the responsive prefixies too.

```
$newUtilities = (
  w-100: (
    width: '100%';
  )
);

@add-utilities($newUtilities, true);
```

After you added a new utility you can use with the @apply mixin:

```
.btn {
  @include apply('w-100');
}
```
