package edu.cit.cleverbee.Entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity
public class StudyPlace {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private double lat;
    private double lng;
    private String type;
    private String openHours;


    public StudyPlace() {}

    public StudyPlace(String name, double lat, double lng, String type, String openHours, int seatsAvailable) {
        this.name = name;
        this.lat = lat;
        this.lng = lng;
        this.type = type;
        this.openHours = openHours;
    }

    // Getters and setters

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public double getLat() {
        return lat;
    }

    public double getLng() {
        return lng;
    }

    public String getType() {
        return type;
    }

    public String getOpenHours() {
        return openHours;
    }

   

    public void setId(Long id) {
        this.id = id;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setLat(double lat) {
        this.lat = lat;
    }

    public void setLng(double lng) {
        this.lng = lng;
    }

    public void setType(String type) {
        this.type = type;
    }

    public void setOpenHours(String openHours) {
        this.openHours = openHours;
    }

   
}
