
export function getCurrentLocation() {
    let lat;
    let lng;
    if (!navigator.geolocation) {
        alert("Geolocation is not supported by this browser.");
        return
    }

    return navigator.geolocation.getCurrentPosition((position: any) => {
        if (position) {
            console.log("Latitude: " + position.coords.latitude +
                "Longitude: " + position.coords.longitude);
            lat = position.coords.latitude;
            lng = position.coords.longitude;
            console.log(lat);
            console.log(lat);
        }
    },
        (error: any) => console.log(error));

}
