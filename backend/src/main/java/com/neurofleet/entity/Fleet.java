package com.neurofleet.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

/**
 * Fleet Entity - Represents a vehicle in the NeuroFleet logistics platform.
 * 
 * Maps to the 'fleets' table in PostgreSQL.
 * Uses UUID as primary key for distributed system compatibility.
 * Includes JPA validation annotations for data integrity.
 */
@Entity
@Table(name = "fleets", indexes = {
    @Index(name = "idx_fleet_status", columnList = "status"),
    @Index(name = "idx_fleet_type", columnList = "type"),
    @Index(name = "idx_fleet_location", columnList = "currentLocation")
})
public class Fleet {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @NotBlank(message = "Vehicle name is required")
    @Size(min = 2, max = 100, message = "Name must be between 2 and 100 characters")
    @Column(nullable = false, length = 100)
    private String name;

    @NotNull(message = "Vehicle type is required")
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private VehicleType type;

    @NotNull(message = "Status is required")
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private VehicleStatus status;

    @NotBlank(message = "Current location is required")
    @Column(nullable = false)
    private String currentLocation;

    @NotNull(message = "Latitude is required")
    @Column(nullable = false, precision = 10, scale = 7)
    private BigDecimal latitude;

    @NotNull(message = "Longitude is required")
    @Column(nullable = false, precision = 10, scale = 7)
    private BigDecimal longitude;

    @NotBlank(message = "Driver name is required")
    @Column(nullable = false)
    private String driver;

    @Min(value = 0, message = "Fuel level cannot be negative")
    @Max(value = 100, message = "Fuel level cannot exceed 100%")
    @Column(nullable = false)
    private Integer fuelLevel;

    @Column(nullable = false)
    private String capacity;

    private String lastMaintenance;

    private String nextDelivery;

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;

    // Default constructor required by JPA
    public Fleet() {}

    // Getters and Setters
    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public VehicleType getType() { return type; }
    public void setType(VehicleType type) { this.type = type; }

    public VehicleStatus getStatus() { return status; }
    public void setStatus(VehicleStatus status) { this.status = status; }

    public String getCurrentLocation() { return currentLocation; }
    public void setCurrentLocation(String currentLocation) { this.currentLocation = currentLocation; }

    public BigDecimal getLatitude() { return latitude; }
    public void setLatitude(BigDecimal latitude) { this.latitude = latitude; }

    public BigDecimal getLongitude() { return longitude; }
    public void setLongitude(BigDecimal longitude) { this.longitude = longitude; }

    public String getDriver() { return driver; }
    public void setDriver(String driver) { this.driver = driver; }

    public Integer getFuelLevel() { return fuelLevel; }
    public void setFuelLevel(Integer fuelLevel) { this.fuelLevel = fuelLevel; }

    public String getCapacity() { return capacity; }
    public void setCapacity(String capacity) { this.capacity = capacity; }

    public String getLastMaintenance() { return lastMaintenance; }
    public void setLastMaintenance(String lastMaintenance) { this.lastMaintenance = lastMaintenance; }

    public String getNextDelivery() { return nextDelivery; }
    public void setNextDelivery(String nextDelivery) { this.nextDelivery = nextDelivery; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }

    /**
     * Vehicle type enumeration.
     */
    public enum VehicleType {
        TRUCK, DRONE, VAN, SHIP, ROBOT
    }

    /**
     * Vehicle status enumeration.
     */
    public enum VehicleStatus {
        ACTIVE, IDLE, MAINTENANCE, OFFLINE
    }
}
