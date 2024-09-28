import { Component } from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import Swal from "sweetalert2";
import { SweetalertService } from 'src/app/shared/sweetalert/sweetalert.service';
import {WebstorgeService} from "../../../shared/webstorge.service";
import {AuthService} from "../../../../api-service/service/AuthService";
import {DriverService} from "../../../../api-service/service/DriverService";
import {RoleService} from "../../../../api-service/service/RoleService";

@Component({
  selector: 'app-updateprofile',
  templateUrl: './updateprofile.component.html',
  styleUrls: ['./updateprofile.component.scss']
})
export class UpdateprofileComponent {
  existingUserId: number | null = null;
  show = false;
  showFilter = false;
  initChecked = false;
  private sweetalert: SweetalertService;
  password='password'

  form = new FormGroup({
    name: new FormControl('', [Validators.required]),
    username: new FormControl('', [Validators.required]),
    user_code: new FormControl('', [Validators.required]),
    mobile_num: new FormControl('', [Validators.required, Validators.maxLength(10)]),
    email: new FormControl('', [Validators.required, Validators.email]),
    address: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required]),
    selectedRole: new FormControl(''),
  });


  get f() {
    return this.form.controls;
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

  constructor(private storage: WebstorgeService, private authService: AuthService,
              private driverService:DriverService,private roleService: RoleService) {
  }

  // ngOnInit(): void {
  //   this.loadDrivers();
  //   this.loadRoles();
  // }

  onSubmit() {
    if (this.form.valid) {
      const userData = this.form.value;

      if (this.existingUserId) {
        this.updateUser(this.existingUserId, userData);
      }
      // else {
      //   this.authService.addUser(userData).subscribe(
      //     data => {
      //       console.log('User added successfully', data);
      //       Swal.fire('Success', 'User added successfully!', 'success');
      //       this.loadDrivers();
      //     },
      //     error => {
      //       console.error('Error:', error);
      //       Swal.fire('Error', 'Failed to save user', 'error');
      //     }
      //   );
      // }
    }
    else {
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
