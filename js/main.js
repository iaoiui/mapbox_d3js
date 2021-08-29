// TOKENを秘匿化 別のファイルに書き出し
mapboxgl.accessToken =
  "pk.eyJ1IjoiaWFvaXVpMDcyNyIsImEiOiJja3N3bW0xZ3UxbGMwMm9wanprd2dtNzluIn0.0RolhjD4VG_1e2KvBz4CqQ";
const map = new mapboxgl.Map({
  container: "map",
  style: "mapbox://styles/mapbox/light-v10",
  // 松本
  center: [137.972, 36.238],
  zoom: 14,
});

function filterBy(year) {
  const filters = ["==", "year", year];
  map.setFilter("earthquake-circles", filters);
  map.setFilter("earthquake-labels", filters);

  document.getElementById("year").textContent = year;
}

map.on("load", () => {
  d3.json("./data/matsumoto.geojson", jsonCallback);
});

const minYear = 2014;

function jsonCallback(err, data) {
  if (err) {
    throw err;
  }

  // Create a year property value based on time
  // used to filter against.
  data.features = data.features.map((d) => {
    d.properties.year = new Date(d.properties.time).getFullYear();
    return d;
  });

  //
  map.addSource("earthquakes", {
    type: "geojson",
    data: data,
  });

  map.addLayer({
    id: "earthquake-circles",
    type: "circle",
    source: "earthquakes",
    paint: {
      "circle-color": [
        "interpolate",
        ["linear"],
        ["get", "hoge"],
        6,
        "#a3f3e8",
        8,
        "#1139e9",
      ],
      "circle-opacity": 0.75,
      "circle-radius": [
        "interpolate",
        ["linear"],
        ["get", "hoge"],
        6,
        20,
        10,
        60,
      ],
    },
  });

  map.addLayer({
    id: "earthquake-labels",
    type: "symbol",
    source: "earthquakes",
    layout: {
      // "text-field": ["concat", ["to-string", ["get", "mag"]], "m"],
      // ["get", "XXX"]で特定のフィールドを取得
      "text-field": ["to-string", ["get", "content"]],
      // "text-field": "松本に幽閉",
      "text-font": ["Open Sans Bold", "Arial Unicode MS Bold"],
      "text-size": 12,
    },
    paint: {
      "text-color": "rgba(0,0,0,0.5)",
    },
  });

  // Set filter to first year to the slider
  filterBy(minYear);

  document.getElementById("slider").addEventListener("input", (e) => {
    const year = parseInt(e.target.value, 10) + minYear;
    filterBy(year);
  });
}
