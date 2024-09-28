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
import {DriverService} from "../../../../api-service/service/DriverService";
import {RoleService} from "../../../../api-service/service/RoleService";
import html2canvas from "html2canvas";
import jsPDF from 'jspdf';

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
  existingUserId: number | null = null;
  selectedList1: data[] = [{ value: 'Disable' }, { value: 'Enable' }];
  password='password'
  show = false;
  showFilter = false;
  initChecked = false;
  private sweetalert: SweetalertService;
  public tableData = [];
  public searchDataValue = '';
  public routes = routes;
  role: any;
  roles: string[] = [];
  dataSource!: MatTableDataSource<userList>;
  ROLE_ADMIN?: string="ROLE_ADMIN";
  ROLE_DRIVER?: string="ROLE_DRIVER";
  ROLE_PASSENGER?: string ="ROLE_PASSENGER";
  ROLE_TELEPHONE_OPERATOR?: string ="ROLE_TELEPHONE_OPERATOR";

  form = new FormGroup({
    name: new FormControl('', [Validators.required]),
    username: new FormControl('', [Validators.required]),
    user_code: new FormControl('', [Validators.required]),
    mobile_num: new FormControl('', [Validators.required, Validators.maxLength(10)]),
    email: new FormControl('', [Validators.required, Validators.email]),
    address: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required]),
    role: new FormControl([''], [Validators.required]),
  });

  onRoleChange(event: any) {
    const selectedRole = event.value;
    console.log("Selected Role:", selectedRole);

    // Clear the array and push the selected role into it
    this.roles = [];
    this.roles.push(selectedRole);
    this.form.patchValue({ role: this.roles });
  }

  constructor(private storage: WebstorgeService, private authService: AuthService,
              private driverService:DriverService,private roleService: RoleService) {
  }

  ngOnInit(): void {
    this.loadDrivers();
    this.loadRoles();
  }

  loadRoles() {
    this.roleService.getAllRollList().subscribe(
      (response: any) => {
        this.roles = response.data;
      },
      (error) => {
        console.error('Error fetching roles:', error);
      }
    );
  }

  //Function to load drivers
  loadDrivers() {
    this.driverService.getDrivers().subscribe(
      (response: any) => {
        this.tableData = response;
      },
      (error) => {
        console.error('Error loading drivers:', error);
        Swal.fire('Error', 'Failed to load drivers', 'error');
      }
    );
  }

  get f() {
    return this.form.controls;
  }
  viewBtn() {
    this.sweetalert.deleteBtn();
  }

  deleteBtn(userId: number) {
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
            Swal.fire('Deleted!', 'Deleted Successfully.', 'success');
            this.loadDrivers();
          },
          error => {
            console.error('Error deleting user:', error);
            Swal.fire('Error', 'Failed to delete', 'error');
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
      mobile_num: users.mobile_num || '',
      email: users.email || '',
      address: users.address || '',
      role: this.roles,
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
            Swal.fire('Success', 'Saved successfully!', 'success');
            this.loadDrivers();
          },
          error => {
            console.error('Error:', error);
            Swal.fire('Error', 'Failed to save user', 'error');
          }
        );
      }
    } else {
      this.form.markAllAsTouched();
      Swal.fire('Error', 'Please input required fields !', 'error');
    }
  }

  updateUser(existUserId: number, userData: any) {
    if (this.form.valid) {
      this.driverService.updateUser(existUserId, userData).subscribe(
        data => {
          console.log('Response:', data);
          Swal.fire('Success', 'Update Successfully!', 'success');
        },
        error => {
          console.error('Error:', error);
          Swal.fire('Error', 'Failed to Update', 'error');
        }
      );
    } else {
      this.form.markAllAsTouched();
    }
  }

  generatePDF() {
    const data = document.getElementById('tableContent');

    html2canvas(data!).then(canvas => {
      const imgWidth = 208;
      const pageHeight = 295;
      const imgHeight = canvas.height * imgWidth / canvas.width;
      const heightLeft = imgHeight;

      const contentDataURL = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4'); // A4 size page of PDF
      const position = 0;

      pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight);
      pdf.save('table-data.pdf'); // Generated PDF will be saved here
    });
  }
}
