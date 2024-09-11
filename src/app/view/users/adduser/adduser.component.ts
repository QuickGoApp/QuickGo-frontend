import { Component } from '@angular/core';
import { routes } from 'src/app/core/routes-path/routes';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import Swal from "sweetalert2";
import {WebstorgeService} from "../../../shared/webstorge.service";
import {AuthService} from "../../../../api-service/service/AuthService";
interface data {
  value: string;
}
@Component({
  selector: 'app-adduser',
  templateUrl: './adduser.component.html',
  styleUrls: ['./adduser.component.scss']
})
export class AdduserComponent {
  password='password'
  show = false;
  public routes = routes;
  userRoles: data[] = [
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
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
    username: new FormControl(''),
    clientId: new FormControl(''),
    apiKey: new FormControl(''),
    name: new FormControl('', [Validators.required]),
    sellingCategory: new FormControl(''),
    sellingContact: new FormControl(''),
    mobileNum: new FormControl('', [Validators.required,Validators.maxLength(10)]),
    role: new FormControl([''], [Validators.required]),
  });
  ROLE_ADMIN?: string="admin";
  ROLE_TRAINER?: string="trainer";

  constructor(private storage: WebstorgeService, private authService: AuthService) {
  }

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

  onSubmit() {
    console.log('user form')
    console.log(this.form.value)
    if (this.form.valid) {
      this.form.value.username = this.form.value.email
      this.authService.addUser(this.form.value).subscribe(
        data=>{
          console.log(data)
          Swal.fire(
            '',
            'User Save Success!',
            'success'
          )
          // this.storage.submit();
        },
        error => {
          console.log(error)
          Swal.fire(
            '',
            error.error.data,
            'error'
          )
        }
      )
    } else {
      this.form.markAllAsTouched();
    }
  }


}
