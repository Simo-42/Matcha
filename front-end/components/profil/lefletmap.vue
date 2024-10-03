<template>
	<div
		ref="mapContainer"
		style="width: 100%; height: 400px"></div>
</template>

<script setup>
import { onMounted, ref, watch } from "vue";
import L from "leaflet";

// Assurez-vous que les styles Leaflet sont importés
import "leaflet/dist/leaflet.css";

const props = defineProps({
	latitude: {
		type: Number,
		required: true,
	},
	longitude: {
		type: Number,
		required: true,
	},
});

const mapContainer = ref(null);
let map = null;

onMounted(() => {
	if (mapContainer.value) {
		// Initialiser la carte avec les coordonnées passées en props
		map = L.map(mapContainer.value).setView([props.latitude, props.longitude], 13);

		L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
			maxZoom: 19,
			attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
		}).addTo(map);

		// Ajouter un marqueur sur la localisation actuelle
		L.marker([props.latitude, props.longitude]).addTo(map).bindPopup("Your selected location.").openPopup();
	}
});

// Watcher pour mettre à jour la carte si les coordonnées changent
watch(
	() => [props.latitude, props.longitude],
	([newLat, newLon]) => {
		if (map) {
			map.setView([newLat, newLon], 13);
			L.marker([newLat, newLon]).addTo(map).bindPopup("Updated location").openPopup();
		}
	}
);
</script>

<style scoped>
/* Ajoutez ici des styles supplémentaires si nécessaire */
</style>
