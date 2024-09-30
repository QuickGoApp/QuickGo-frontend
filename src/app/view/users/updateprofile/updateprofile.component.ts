import { Component } from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import Swal from "sweetalert2";
import { SweetalertService } from 'src/app/shared/sweetalert/sweetalert.service';
import {UserService} from "../../../../api-service/service/UserService";

@Component({
  selector: 'app-updateprofile',
  templateUrl: './updateprofile.component.html',
  styleUrls: ['./updateprofile.component.scss']
})
export class UpdateprofileComponent {
  show = false;


  private sweetalert: SweetalertService;
  password='password'
  userDetail: any = null; // Store the submitted cart details
  public isAdmin = false;
  form = new FormGroup({
    name: new FormControl('', [Validators.required]),
    username: new FormControl('', [Validators.required]),
    mobile_num: new FormControl('', [Validators.required, Validators.maxLength(10)]),
    email: new FormControl('', [Validators.required, Validators.email]),
    address: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required]),
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

  constructor(private userService:UserService) {
    this.findUserDetailByCode();
    if (sessionStorage.getItem("role")=="ROLE_ADMIN"){
      this.isAdmin = true;
    }
  }


  onSubmit() {
    if (this.form.valid) {
      const userData = this.form.value;
      userData['id']=this.userDetail.id;
      this.updateUser( userData);


    }
    else {
      this.form.markAllAsTouched();
    }
  }

  updateUser( userData: any) {
    if (this.form.valid) {
      this.userService.updateUser( userData).subscribe(
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

  private findUserDetailByCode() {
    const payload={
      user_code:sessionStorage.getItem("userId")
    }
    this.userService.findUserDetailByCode(payload).subscribe(value => {
      if (value.statusCode==200){
        this.userDetail = value.data;
        // Set form values from the retrieved user details
        this.form.patchValue({
          name: this.userDetail.name,
          username: this.userDetail.username,
          mobile_num: this.userDetail.mobile_num,
          email: this.userDetail.email,
          address: this.userDetail.address,
          password: ''
        });
      }
    })
  }
}
