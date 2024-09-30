import {Component, OnInit} from '@angular/core';
import {routes} from 'src/app/core/routes-path/routes';
import {FormControl, FormGroup, ValidationErrors, Validators} from "@angular/forms";
import Swal from "sweetalert2";
import {VehicleService} from "../../../../api-service/service/VehicleService";
import {DriverService} from "../../../../api-service/service/DriverService";
import {MatTableDataSource} from "@angular/material/table";
import {userList} from "../../../shared/model/page.model";
import {Sort} from "@angular/material/sort";
import {el} from "@fullcalendar/core/internal-common";

interface data {
  value: string;
}

@Component({
  selector: 'app-managevehicles',
  templateUrl: './managevehicles.component.html',
  styleUrls: ['./managevehicles.component.scss']
})
export class ManagevehiclesComponent implements OnInit {
  public routes = routes;
  existingVehicleId: number | null = null;
  show = false;
  public tableData = [];
  password = 'password'
  drivers: any[] = [];  //Store the list of drivers
  selectedDriver: any;
  showFilter = false;
  public searchDataValue = '';
  dataSource!: MatTableDataSource<userList>;
  public selectedValue1 = '';
  selectedList1: data[] = [{value: 'Disable'}, {value: 'Enable'}];
  initChecked = false;

  imageUrl: string | ArrayBuffer | null = null; // To store the image preview URL
  selectedFile: File | null = null; // To store the selected file


  form = new FormGroup({
    vehicle_name: new FormControl(''),
    vehicle_number: new FormControl(''),
    type: new FormControl(''),
    color: new FormControl(''),
    vehicle_conditions: new FormControl(''),
    seats: new FormControl(''),
    selectedDriver: new FormControl(''),
    image: new FormControl(''),
    icon: new FormControl(''),

  });

  roles: string[] = [];
  selectedRole: string;

  constructor(private vehicleService: VehicleService,
              private driverService: DriverService) {
  }

  onFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;

      // Display the image preview
      const reader = new FileReader();
      reader.onload = (e) => {
        this.imageUrl = e.target?.result;
      };
      reader.readAsDataURL(file);
    }
  }


  date = new Date();

  onVehicleTypeChange(event: any) {
    Object.keys(this.form.controls).forEach(key => {
      const controlErrors: ValidationErrors = this.form.get(key).errors;
      if (controlErrors != null) {
        console.log('Key control: ' + key + ', errors: ' + JSON.stringify(controlErrors));
      }
    });
  }

  public searchData(value: string): void {
    this.dataSource.filter = value.trim().toLowerCase();
    this.tableData = this.dataSource.filteredData;
  }

  ngOnInit(): void {
    this.loadDrivers();
    this.loadVehicles();

  }

  get f() {
    return this.form.controls;
  }

  public sortData(sort: Sort) {
    const data = this.tableData.slice();

    if (!sort.active || sort.direction === '') {
      this.tableData = data;
    } else {
      this.tableData = data.sort((a: any, b: any) => {
        const aValue = (a as any)[sort.active];
        const bValue = (b as any)[sort.active];
        return (aValue < bValue ? -1 : 1) * (sort.direction === 'asc' ? 1 : -1);
      });
    }
  }

  selectAll(initChecked: boolean) {
    if (!initChecked) {
      this.tableData.forEach((f) => {
        f.isSelected = true;
      });
    } else {
      this.tableData.forEach((f) => {
        f.isSelected = false;
      });
    }
  }

  //Function to load vehicles
  loadDrivers() {
    this.driverService.getUnAllocateDrivers().subscribe((response: any) => {
      if (response.statusCode == 200) {
        this.drivers = response.data;
      }

    }, error => {
      Swal.fire('Error', 'Error fetching drivers', 'error');
      console.error('Error fetching drivers:', error);
    });
  }

  loadVehicles() {
    this.vehicleService.getVehicles().subscribe(
      (response: any) => {
        if (response.statusCode == 200) {
          this.tableData = response.data;
        }

      },
      (error) => {
        console.error('Error loading vehicles:', error);
        Swal.fire('Error', 'Failed to load vehicles', 'error');
      }
    );
  }

  onDriverChange(event: any) {
    this.selectedDriver = event.value;
    console.log('Selected Driver ID:', event.value);  // Handle the selected driver
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
    const selectedDriver = this.drivers.find(driver => driver.name === vehicle.selectedDriverName);
    this.form.patchValue({
      vehicle_name: vehicle.vehicle_name || '',
      vehicle_number: vehicle.vehicle_number || '',
      type: vehicle.type || '',
      color: vehicle.color || '',
      vehicle_conditions: vehicle.vehicle_conditions || '',
      seats: vehicle.seats || '',
      selectedDriver: selectedDriver ? selectedDriver.id : null,
    });
    this.existingVehicleId = vehicle.id;
  }

  onSubmit() {
    console.log("urllll " + this.imageUrl)
    console.log("image file " + this.selectedFile)
    if (this.form.valid) {
      const vehicleData = this.form.value;

      if (this.existingVehicleId) {
        this.updateVehicle(this.existingVehicleId, vehicleData);
        this.loadVehicles();
      } else {

        this.vehicleService.uploadImage(this.selectedFile).subscribe(response => {
          if (response.statusCode == 200) {
            this.form.get("image")?.setValue(response.data);

            // Set the vehicle icon based on the selected role
            if (this.selectedRole === "three_wheel") {
              this.form.get("icon")?.setValue("assets/img/vehicle/tuckicon.png");
            } else if (this.selectedRole === "car") {
              this.form.get("icon")?.setValue("assets/img/vehicle/caricon.png");
            } else if (this.selectedRole === "bike") {
              this.form.get("icon")?.setValue("assets/img/vehicle/bicicon.png");
            }
            // Now add the image URL and icon to the vehicleData object
            vehicleData['image'] = response.data;
            vehicleData['icon'] = this.form.get("icon")?.value;

            this.saveVehicleDetails(vehicleData);
            this.loadVehicles();
          }

        });

      }
    } else {
      this.form.markAllAsTouched();
    }
  }

  private saveVehicleDetails(vehicleData: any) {
    console.log("save image data  " + JSON.stringify(vehicleData))

    // vehicle data add variable "image" and set response.data
    this.vehicleService.addVehicle(vehicleData).subscribe(
      response => {
        if (response.statusCode == 200) {
          Swal.fire('Success', 'Vehicle added successfully!', 'success');
          this.loadVehicles();
        } else {
          Swal.fire('Error', response.message, 'error');
        }
      },
      error => {
        console.error('Error:', error);
        Swal.fire('Error', 'Failed to save vehicle', 'error');
      }
    );

  }

  updateVehicle(existVehicleId: number, userData: any) {
    if (this.form.valid) {
      this.vehicleService.updateVehicle(existVehicleId, userData).subscribe(
        response => {
          if (response.statusCode == 200) {
            Swal.fire('Success', 'Vehicle Updated Successfully!', 'success');
          }
        },
        error => {
          console.error('Error:', error);
          Swal.fire('Error', 'Failed to Update vehicle', 'error');
        }
      );
    } else {
      this.form.markAllAsTouched();
    }
  }

  deleteBtn(vehicleId: number) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover this Vehicle!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        // Call the service to delete the vehicle
        this.vehicleService.deleteVehicle(vehicleId).subscribe(
          () => {
            Swal.fire('Deleted!', 'Deleted vehicle successfully !', 'success');
            this.loadDrivers();
            this.loadVehicles();
          },
          error => {
            console.error('Error deleting user:', error);
            Swal.fire('Error', 'Failed to delete the driver.', 'error');
          }
        );
      }
    });
  }
}
