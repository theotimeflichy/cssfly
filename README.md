# cssfly

CSSFly est un préprocesseur CSS qui ajoute de nouvelles fonctionnalités tels que des variables, import, des tableaux, des foreach et des conditions.

## Documentation

Pour utiliser le programme, il faut utiliser la commande suivante :

```bash
node ./app.js input.cssfly output.css
```

### Embriquement

```scss
.container {
  a {
    color: red;

    :hover {
      color: black;
    }
  }
}
```

### Variables
Il est possible d'utiliser des variables globales et locales. Redefinition possible.

```scss
$a = 10px;
$b = 100px;
$size = $a * $b;
$size = $a + $b;

.container {
    height: $size;
}

.container-fluid {
  $size = 5px;
  height: $size;
}
```

### Conditions

```scss
@if(1 == 1)
h2 {
  color: red;
}
@elseif(false)
h2 {
  color: green;
}
@else
h2 {
  color: black;
}
@endif;
```

### Tableau & foreach

```scss
$time = [(day, blue), (night, dark), (evening, pink)];

@each $name, $color in $time

    .time-$name{
        color:$color;
    }

@endeach
```

```scss
$pd-size = [1, 2, 5, 18, 14];

@each $size in $pd-size

    .padding-$size{
        padding:$size;
    }

@endeach
```

### Commentaires

```scss
/* Un commentaire simple */
/**
  * Un long commentaire
  * sur plusieurs
  * lignes !
  */
```

### Imports

Il est possible d'importer des fichier externes et internes (chemin débute à la racine de cssfly).

```scss
@import("https://google.com/style.css");
@import("style.css");
@import("style.cssfly");
```
