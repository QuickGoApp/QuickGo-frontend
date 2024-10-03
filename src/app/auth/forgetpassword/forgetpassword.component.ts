import {Component} from '@angular/core';
import {routes} from '../../core/core.index';
import {UserService} from "../../../api-service/service/UserService";
import {el} from "@fullcalendar/core/internal-common";
import Swal from "sweetalert2";
import {FormControl, Validators} from "@angular/forms";
import {Router} from "@angular/router";

@Component({
  selector: 'app-forgetpassword',
  templateUrl: './forgetpassword.component.html',
  styleUrls: ['./forgetpassword.component.scss'],
})
export class ForgetpasswordComponent {
  public routes = routes;
  public email = ''; // Initialize email property
  public otp: any = ['', '', '', '', '', '']; // Initialize OTP array
  private responcValues;

  public isSendOtp = true;
  public isVerifyOtp = false;

  constructor(private userService: UserService, private router: Router) {

  }

  onOtpInput(event: Event, index: number) {
    const input = event.target as HTMLInputElement;
    const value = input.value;

    // Check if the input is not empty and is a digit
    if (value && !isNaN(Number(value))) {
      this.otp[index] = value; // Set the value at the current index
      // Move focus to the next input if available
      const nextInput = (input.nextElementSibling as HTMLInputElement);
      if (nextInput) {
        nextInput.focus();
      }
    } else {
      // Clear the input if not a digit
      input.value = '';
    }

    // Handle backspace (deleting digits)
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Backspace') {
        console.log("back space", this.otp[index])
        // Clear the value at the current index
        this.otp[index] = ''; // Clear current OTP input
        // Move focus to the previous input if available
        const previousInput = (input.previousElementSibling as HTMLInputElement);
        if (previousInput) {
          previousInput.focus();
        }
      }
    });
  }

  sendOtp() {
    if (this.email) {
      const payload = {
        email: this.email,
      }
      this.userService.otpSend(payload).subscribe(value => {
        if (value.statusCode == 200) {
          this.responcValues = value.data;
          this.isSendOtp = false;
          this.isVerifyOtp = true;
          console.log(JSON.stringify(this.responcValues));
        } else {
          Swal.fire({
            title: 'warning!',
            text: value.message,
            icon: 'warning',
            confirmButtonText: 'OK'
          });
        }
      });

    } else {
      Swal.fire({
        title: 'warning!',
        text: "enter valid email address",
        icon: 'warning',
        confirmButtonText: 'OK'
      });
    }
  }

  onSubmit() {
    const otpString = this.otp.join('');
    if (this.responcValues.otp && otpString.length === 6) {
      if (this.responcValues.otp == otpString) {
        const payload = {
          id:this.responcValues.id,
          name: this.responcValues.name,
          username: this.responcValues.username,
          mobile_num: this.responcValues.mobile_num,
          email: this.responcValues.email,
          address: this.responcValues.address,
          password: otpString,
        }
        this.userService.updateUser(payload).subscribe(value => {
          if (value.statusCode == 200) {
            Swal.fire({
              title: 'Success',
              text: '',
              icon: 'success',
              confirmButtonText: 'OK'
            });
            this.router.navigate([routes.signIn]);
          } else {
            Swal.fire({
              title: 'warning!',
              text: value.message,
              icon: 'warning',
              confirmButtonText: 'OK'
            });
          }
        });
      } else {
        Swal.fire({
          title: 'warning!',
          text: 'otp is not match',
          icon: 'warning',
          confirmButtonText: 'OK'
        });
      }

    } else {
      Swal.fire({
        title: 'warning!',
        text: 'check your otp',
        icon: 'warning',
        confirmButtonText: 'OK'
      });
    }
  }
}
