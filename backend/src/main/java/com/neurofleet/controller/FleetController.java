package com.neurofleet.controller;

import com.neurofleet.entity.Fleet;
import com.neurofleet.dto.FleetRequest;
import com.neurofleet.dto.FleetResponse;
import com.neurofleet.service.FleetService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

/**
 * Fleet Management REST Controller.
 * 
 * All endpoints are secured with @PreAuthorize("hasRole('ADMIN')") ensuring
 * only administrators can perform CRUD operations on fleet vehicles.
 * 
 * The security is enforced at the method level, providing defense-in-depth
 * beyond the URL-based security in SecurityConfig.
 * 
 * Endpoints:
 *   GET    /api/admin/fleets       - List all vehicles
 *   GET    /api/admin/fleets/{id}  - Get vehicle by ID
 *   POST   /api/admin/fleets       - Register new vehicle
 *   PUT    /api/admin/fleets/{id}  - Update vehicle
 *   DELETE /api/admin/fleets/{id}  - Remove vehicle
 */
@RestController
@RequestMapping("/api/admin/fleets")
@CrossOrigin(origins = "${app.cors.allowed-origins}")
public class FleetController {

    private final FleetService fleetService;

    public FleetController(FleetService fleetService) {
        this.fleetService = fleetService;
    }

    /**
     * GET /api/admin/fleets
     * Returns all fleet vehicles with pagination support.
     * Requires ADMIN role.
     */
    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<FleetResponse>> getAllFleets(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String type) {
        
        List<FleetResponse> fleets = fleetService.getAllFleets(page, size, status, type);
        return ResponseEntity.ok(fleets);
    }

    /**
     * GET /api/admin/fleets/{id}
     * Returns a single fleet vehicle by ID.
     * Requires ADMIN role.
     */
    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<FleetResponse> getFleetById(@PathVariable UUID id) {
        FleetResponse fleet = fleetService.getFleetById(id);
        return ResponseEntity.ok(fleet);
    }

    /**
     * POST /api/admin/fleets
     * Registers a new vehicle in the fleet.
     * Requires ADMIN role.
     * Request body validated with @Valid.
     */
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<FleetResponse> createFleet(@Valid @RequestBody FleetRequest request) {
        FleetResponse created = fleetService.createFleet(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    /**
     * PUT /api/admin/fleets/{id}
     * Updates an existing fleet vehicle.
     * Requires ADMIN role.
     */
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<FleetResponse> updateFleet(
            @PathVariable UUID id,
            @Valid @RequestBody FleetRequest request) {
        
        FleetResponse updated = fleetService.updateFleet(id, request);
        return ResponseEntity.ok(updated);
    }

    /**
     * DELETE /api/admin/fleets/{id}
     * Removes a vehicle from the fleet.
     * Requires ADMIN role.
     * Returns 204 No Content on success.
     */
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteFleet(@PathVariable UUID id) {
        fleetService.deleteFleet(id);
        return ResponseEntity.noContent().build();
    }

    /**
     * PATCH /api/admin/fleets/{id}/status
     * Quick status update endpoint for real-time fleet management.
     * Requires ADMIN role.
     */
    @PatchMapping("/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<FleetResponse> updateFleetStatus(
            @PathVariable UUID id,
            @RequestParam String status) {
        
        FleetResponse updated = fleetService.updateStatus(id, status);
        return ResponseEntity.ok(updated);
    }
}
