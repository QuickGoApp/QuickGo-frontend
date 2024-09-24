import { Component } from '@angular/core';
import { routes } from 'src/app/core/routes-path/routes';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import Swal from "sweetalert2";
import { SweetalertService } from 'src/app/shared/sweetalert/sweetalert.service';
import {WebstorgeService} from "../../../shared/webstorge.service";
import {AuthService} from "../../../../api-service/service/AuthService";


@Component({
  selector: 'app-updatedriver',
  templateUrl: './updatedriver.component.html',
  styleUrls: ['./updatedriver.component.scss']
})
export class UpdatedriverComponent {
  private sweetalert: SweetalertService;
  public routes = routes;
  show = false;


  form = new FormGroup({
    // Existing fields
    // name: new FormControl('', [Validators.required]),
    // username: new FormControl('', [Validators.required]),
    // //user_code: new FormControl('', [Validators.required]),
    // vehicleName: new FormControl('', Validators.required),
    // vehicleNumber: new FormControl('', Validators.required),
    // vehicleConditions: new FormControl('', Validators.required),
    // color: new FormControl('', Validators.required),
    // seats: new FormControl('', Validators.required),
    // mobileNum: new FormControl('', [Validators.required, Validators.maxLength(10)]),
    // email: new FormControl('', [Validators.required, Validators.email]),
    // address: new FormControl('', [Validators.required]),
    // password: new FormControl('', [Validators.required]),
    // role: new FormControl([''], [Validators.required]), // Ensure the role is set to 'ROLE_DRIVER'
  });

  constructor(private storage: WebstorgeService, private authService: AuthService) {

  }

  onSubmit() {
    console.log('Driver form submission:', this.form.value);  // Log the entire form data
    if (this.form.valid) {
      this.authService.addUser(this.form.value).subscribe(
        data => {
          console.log('Response:', data);
          Swal.fire('Success', 'Driver Save Success!', 'success');
        },
        error => {
          console.error('Error:', error);
          Swal.fire('Error', 'Failed to save driver', 'error');
        }
      );
    } else {
      this.form.markAllAsTouched();
    }
  }

  onClick() {
    // if (this.password === 'password') {
    //   this.password = 'text';
    //   this.show = true;
    // } else {
    //   this.password = 'password';
    //   this.show = false;
    // }
  }

  get f() {
    return this.form.controls;
  }



}
