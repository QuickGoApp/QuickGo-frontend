import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { routes } from 'src/app/core/routes-path/routes';
import { WebstorgeService } from 'src/app/shared/webstorge.service';
import {AuthService} from "../../../api-service/service/AuthService";
import Swal from "sweetalert2";

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
})
export class SignupComponent {
  public routes = routes;
  password = 'password';
  show = false;
  public CustomControler: undefined;

  form = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
    username: new FormControl('', [Validators.required, Validators.minLength(3)]),
    role: new FormControl(['passenger'], [Validators.required]),
  });

  get f() {
    return this.form.controls;
  }

  constructor(private storage: WebstorgeService, private authService: AuthService) {
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
  submit() {
    if (this.form.valid) {
      console.log(this.form.value)
      this.authService.signup(this.form.value).subscribe(
        data=>{
          console.log(data)
          this.storage.submit();
        },
        error => {
          Swal.fire(
            '',
            error.error.message,
            'error'
          )
        }
      )
    } else {
      this.form.markAllAsTouched();
    }
  }
}
