import {Component} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {routes} from 'src/app/core/routes-path/routes';
import {WebstorgeService} from 'src/app/shared/webstorge.service';
import {AuthService} from "../../../api-service/service/AuthService";
import Swal from "sweetalert2";

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss'],
})
export class SigninComponent {
  public routes = routes;
  password = 'password';
  show = false;

  form = new FormGroup({
    username: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required]),
  });

  get f() {
    return this.form.controls;
  }

  constructor(private storage: WebstorgeService, private authService: AuthService) {

  }


  submit() {
    if (this.form.valid) {
      this.authService.signIn(this.form.value).subscribe(
        data => {
          console.log(data)
          this.storage.login(data);
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

  onClick() {
    if (this.password === 'password') {
      this.password = 'text';
      this.show = true;
    } else {
      this.password = 'password';
      this.show = false;
    }
  }
}
