import {Component, OnInit} from '@angular/core';
import { routes } from 'src/app/core/routes-path/routes';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import Swal from "sweetalert2";
import {WebstorgeService} from "../../../shared/webstorge.service";
import {AuthService} from "../../../../api-service/service/AuthService";
import {SweetalertService} from "../../../shared/sweetalert/sweetalert.service";
import {MatTableDataSource} from "@angular/material/table";
import {userList} from "../../../shared/model/page.model";
import {DriverService} from "../../../../api-service/service/DriverService";
import {RoleService} from "../../../../api-service/service/RoleService";
import {Sort} from "@angular/material/sort";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
interface data {
  value: string;
}
@Component({
  selector: 'app-adduser',
  templateUrl: './adduser.component.html',
  styleUrls: ['./adduser.component.scss']
})
export class AdduserComponent implements OnInit{
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
  selectedRole: any;
  roles: any[] = [];
  dataSource!: MatTableDataSource<userList>;

  form = new FormGroup({
    name: new FormControl('', [Validators.required]),
    username: new FormControl('', [Validators.required]),
    mobile_num: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    address: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required]),
    role: new FormControl([], Validators.required) // Handle roles as array
  });


  onRoleChange(event: any) {
    this.selectedRole = event.value; // Logic to handle role change
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
  onClick() {
    if (this.password === 'password') {
      this.password = 'text';
      this.show = true;
    } else {
      this.password = 'password';
      this.show = false;
    }
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
            Swal.fire('Deleted!', 'User Deleted Successfully.', 'success');
            this.loadDrivers();
          },
          error => {
            console.error('Error deleting user:', error);
            Swal.fire('Error', 'Failed to delete the user.', 'error');
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

  onUpdate(users: any) {
    const selectedRole = this.roles.find(role => role.value === users.role_id);
    this.form.patchValue({
      name: users.name || '',
      username: users.username || '',
      // password: users.password,
      mobile_num: users.mobile_num || '',
      email: users.email || '',
      address: users.address || '',
      role: selectedRole ? selectedRole.value : null, // Updated here
    });
    this.existingUserId = users.id;
  }

  onSubmit() {
    if (this.form.valid) {
      // Get the form values
      const formValues = this.form.value;

      // Ensure that the role is passed as an array
      const userData = {
        ...formValues,
        role: [this.selectedRole] // Pass selected role as an array
      };

      console.log("user data: " + JSON.stringify(userData));

      // Check if it's an update or a new user
      if (this.existingUserId) {
        this.updateUser(this.existingUserId, userData);
      } else {
        this.authService.addUser(userData).subscribe(
          data => {
            Swal.fire('Success', 'User added successfully!', 'success');
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
      Swal.fire('Error', 'Please input required fields!', 'error');
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
