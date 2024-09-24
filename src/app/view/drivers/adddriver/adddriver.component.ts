import { Component } from '@angular/core';
import { routes } from 'src/app/core/routes-path/routes';
import { MatTableDataSource } from '@angular/material/table';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import Swal from "sweetalert2";
import { SweetalertService } from 'src/app/shared/sweetalert/sweetalert.service';
import {WebstorgeService} from "../../../shared/webstorge.service";
import {AuthService} from "../../../../api-service/service/AuthService";
import {userList} from "../../../shared/model/page.model";
import {Sort} from "@angular/material/sort";
import {UserService} from "../../../../api-service/service/UserService";
import {PaginationService} from "../../../shared/custom-pagination/pagination.service";
import {Router} from "@angular/router";
import {DriverService} from "../../../../api-service/service/DriverService";
interface data {
  value: string;
}
@Component({
  selector: 'app-adddriver',
  templateUrl: './adddriver.component.html',
  styleUrls: ['./adddriver.component.scss']
})
export class AdddriverComponent {
  public selectedValue1 = '';
  existingUserId: number | null = null;  // Initially null when no user is being edited
  selectedList1: data[] = [{ value: 'Disable' }, { value: 'Enable' }];
  password='password'
  show = false;
  showFilter = false;
  initChecked = false;
  private sweetalert: SweetalertService;
  public tableData = [];
  public searchDataValue = '';
  public routes = routes;
  dataSource!: MatTableDataSource<userList>;
  driverRoles: data[] = [
    {value: 'USER'},
    {value: 'MODERATOR'},
    {value: 'ADMIN'},
    {value: 'DOCTOR'},
    {value: 'MANAGER'},
    {value: 'MARKETING'},
    {value: 'MARKETING_MANAGER'},
    {value: 'ACCOUNTANT'},
    {value: 'ACCOUNTANT_MANAGER'},
    {value: 'PRODUCTION_MANAGER'},
    {value: 'STORE_KEEPER'},
    {value: 'SUPER_ADMIN'},
  ];

  form = new FormGroup({
    // Existing fields
    name: new FormControl('', [Validators.required]),
    username: new FormControl('', [Validators.required]),
    user_code: new FormControl('', [Validators.required]),
    // vehicleName: new FormControl('', Validators.required),
    // vehicleNumber: new FormControl('', Validators.required),
    // vehicleConditions: new FormControl('', Validators.required),
    // color: new FormControl('', Validators.required),
    // seats: new FormControl('', Validators.required),
    mobileNum: new FormControl('', [Validators.required, Validators.maxLength(10)]),
    email: new FormControl('', [Validators.required, Validators.email]),
    address: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required]),
    role: new FormControl([''], [Validators.required]), // Ensure the role is set to 'ROLE_DRIVER'
  });
  ROLE_DRIVER?: string="ROLE_DRIVER";
  ROLE_ADMIN?: string="ROLE_ADMIN";
  ROLE_TRAINER?: string="trainer";

  roles: string[] = [];

  selectedRole: string;

  onRoleChange(event: any) {
    const selectedRole = event.value;
    // Clear the array and push the selected role into it
    this.roles = [];
    this.roles.push(selectedRole); // Add the selected role

    // Update the form control to reflect the array
    this.form.patchValue({ role: this.roles });
  }

  constructor(private storage: WebstorgeService, private authService: AuthService,
              private driverService:DriverService) {

  }

  ngOnInit(): void {
    this.loadDrivers();
  }

  //Function to load drivers
  loadDrivers() {
    this.driverService.getDrivers().subscribe(
      (response: any) => {
        this.tableData = response;  // No need to parse if already an object
      },
      (error) => {
        console.error('Error loading drivers:', error);
        Swal.fire('Error', 'Failed to load drivers', 'error');
      }
    );
  }

  // constructor(
  //
  //   private sweetalert: SweetalertService,
  // ) {
  //
  // }

  get f() {
    return this.form.controls;
  }
  viewBtn() {
    this.sweetalert.deleteBtn();
  }

  deleteBtn(userId: number) {
    // Confirm deletion with SweetAlert before proceeding
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover this driver!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        // Call the service to delete the user
        this.driverService.deleteUser(userId).subscribe(
          () => {
            Swal.fire('Deleted!', 'The driver has been deleted.', 'success');
            this.loadDrivers();  // Refresh the driver list after deletion
          },
          error => {
            console.error('Error deleting user:', error);
            Swal.fire('Error', 'Failed to delete the driver.', 'error');
          }
        );
      }
    });
  }






  date = new Date();

  public searchData(value: string): void {
    this.dataSource.filter = value.trim().toLowerCase();
    this.tableData = this.dataSource.filteredData;
  }

  public sortData(sort: Sort) {
    const data = this.tableData.slice();

    if (!sort.active || sort.direction === '') {
      this.tableData = data;
    } else {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      this.tableData = data.sort((a: any, b: any) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const aValue = (a as any)[sort.active];
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
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


  onClick() {
    if (this.password === 'password') {
      this.password = 'text';
      this.show = true;
    } else {
      this.password = 'password';
      this.show = false;
    }
  }

  onUpdate(users: any) {
    this.form.patchValue({
      name: users.name || '',
      user_code: users.user_code || '',
      username: users.username || '',
      password:  users.password,
      mobileNum: users.mobile_num || '',
      email: users.email || '',
      address: users.address || '',
      role: users.role || ''

    });
    this.existingUserId = users.id;
  }

  onSubmit() {
    if (this.form.valid) {
      const userData = this.form.value;

      if (this.existingUserId) {
        this.updateUser(this.existingUserId, userData);
      } else {
        this.authService.addUser(userData).subscribe(
          data => {
            console.log('User added successfully', data);
            Swal.fire('Success', 'Driver added successfully!', 'success');
            this.loadDrivers();  // Refresh the drivers list after adding a new user
          },
          error => {
            console.error('Error:', error);
            Swal.fire('Error', 'Failed to save driver', 'error');
          }
        );
      }
    } else {
      this.form.markAllAsTouched();
    }
  }

  updateUser(existUserId: number, userData: any) {
    if (this.form.valid) {
      this.driverService.updateUser(existUserId, userData).subscribe(
        data => {
          console.log('Response:', data);
          Swal.fire('Success', 'Driver Update Success!', 'success');
        },
        error => {
          console.error('Error:', error);
          Swal.fire('Error', 'Failed to update driver', 'error');
        }
      );
    } else {
      this.form.markAllAsTouched();
    }
  }
}
