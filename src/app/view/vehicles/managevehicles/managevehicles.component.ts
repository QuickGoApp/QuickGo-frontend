import { Component } from '@angular/core';
import { routes } from 'src/app/core/routes-path/routes';
import {FormControl, FormGroup, ValidationErrors, Validators} from "@angular/forms";
import Swal from "sweetalert2";
import {VehicleService} from "../../../../api-service/service/VehicleService";
import {DriverService} from "../../../../api-service/service/DriverService";
interface data {
  value: string;
}

@Component({
  selector: 'app-managevehicles',
  templateUrl: './managevehicles.component.html',
  styleUrls: ['./managevehicles.component.scss']
})
export class ManagevehiclesComponent {
  selectedVehicleType: string;
  public routes = routes;
  existingVehicleId: number | null = null;
  show = false;
  public tableData = [];
  password='password'
  drivers: any[] = [];  //Store the list of drivers
  selectedDriver: any;

  form = new FormGroup({
    vehicle_name: new FormControl(''),
    vehicle_number: new FormControl(''),
    type: new FormControl(''),
    color: new FormControl(''),
    vehicle_conditions: new FormControl(''),
    seats: new FormControl(''),
    selectedDriver: new FormControl(''),
  });

  roles: string[] = [];
  selectedRole: string;

  constructor(private vehicleService: VehicleService,
              private driverService:DriverService) {
  }

  onVehicleTypeChange(event: any) {
    Object.keys(this.form.controls).forEach(key => {
      const controlErrors: ValidationErrors = this.form.get(key).errors;
      if (controlErrors != null) {
        console.log('Key control: ' + key + ', errors: ' + JSON.stringify(controlErrors));
      }
    });
  }

  ngOnInit(): void {
    this.loadDrivers();

  }
  get f() {
    return this.form.controls;
  }

  //Function to load drivers
  loadDrivers() {
    this.driverService.getDrivers().subscribe((response: any) => {
      this.drivers = response;
    }, error => {
      console.error('Error fetching drivers:', error);
    });
  }

  onDriverChange(event: any) {
    console.log('Selected Driver ID:', event.value);  // Handle the selected driver
    this.selectedDriver = event.value;
  }

  onClick() {
    if (this.password === 'password') {
      this.password = 'text';
      this.show = true;
    } else {
      this.password = 'password';
      this.show = false;
    }
  }

  onUpdate(vehicle: any) {
    console.log('Update button clicked. Vehicle:', vehicle);
    this.form.patchValue({
      vehicle_name: vehicle.vehicle_name || '',
      vehicle_number: vehicle.vehicle_number || '',
      type: vehicle.type || '',
      color: vehicle.color || '',
      vehicle_conditions: vehicle.vehicle_conditions || '',
      seats: vehicle.seats || '',
      selectedDriver: vehicle.selectedDriver || '',
    });
    this.existingVehicleId = vehicle.id;
  }

  onSubmit() {
    if (this.form.valid) {
      const vehicleData = this.form.value;

      if (this.existingVehicleId) {
        console.log('Updating user with ID:', this.existingVehicleId);
      } else {
        this.vehicleService.addVehicle(vehicleData).subscribe(
          data => {
            console.log('Vehicle added successfully', data);
            Swal.fire('Success', 'Vehicle added successfully!', 'success');
            this.loadDrivers();  // Refresh the drivers list after adding a new user
          },
          error => {
            console.error('Error:', error);
            Swal.fire('Error', 'Failed to save vehicle', 'error');
          }
        );
      }
    } else {
      this.form.markAllAsTouched();
    }
  }

  updateVehicle(existVehicleId: number, userData: any) {
    // if (this.form.valid) {
    //   this.authService.updateVehicle(existVehicleId, userData).subscribe(
    //     data => {
    //       console.log('Response:', data);
    //       Swal.fire('Success', 'Vehicle Update Success!', 'success');
    //     },
    //     error => {
    //       console.error('Error:', error);
    //       Swal.fire('Error', 'Failed to Vehicle driver', 'error');
    //     }
    //   );
    // } else {
    //   this.form.markAllAsTouched();
    // }
    // }
  }


}
