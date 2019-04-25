# Real Time Sail Prediction
> Niets is zo veranderlijk als het weer

## Inhoud
* [Concept](#concept)
* [API](#api)
* [Data lifecycle](#data-lifecycle)

## Concept
Deze applicatie haalt de actuele windsnelheid op en berekent de zeilgrootte die een windsurfer bij de actuele wind zou moeten optuigen. Geïnspireerd door [dit project](https://github.com/RoryMearns/Windsurf_Calculator).

![concept schets](bin/schets.jpg)

## API
De app gebruikt de windfinder API om actuele winddata op te halen. Dit wordt gedaan met mijn [wind-scrape](https://github.com/jeroentvb/wind-scrape) project omdat de windfinder API niet helemaal publiek is. Het heeft een key nodig die dagelijks verandert.  
Het nadeel van het feit dat het een niet helemaal publieke API is is dat het geen documentatie heeft, en er dus ook geen rate-limit bekend is.  
Dit is een voorbeeld van een API link, deze zal niet werken wanneer je dit leest. [https://api.windfinder.com/v2/spots/nl248/reports/?limit=-1&timespan=last24h&step=1m&customer=wfweb&version=1.0&token=283501578a0ec424ad6a991d64025be1](https://api.windfinder.com/v2/spots/nl248/reports/?limit=-1&timespan=last24h&step=1m&customer=wfweb&version=1.0&token=283501578a0ec424ad6a991d64025be1)

## Data lifecycle
<details>
<summary>De eerste (getekende) versie van de data lifecycle</summary>
![data lifecycle](bin/data-lifecycle-old.jpg)
</details>

![data lifecycle](bin/data-lifecycle.jpg)
