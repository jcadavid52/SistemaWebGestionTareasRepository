import { Component } from '@angular/core';
import { FormRegisterComponent } from "../../components/form-register-component/form-register-component";
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-register-page',
  imports: [FormRegisterComponent,RouterLink],
  templateUrl: './register-page.html',
  styleUrl: './register-page.css',
})
export class RegisterPage {

}
