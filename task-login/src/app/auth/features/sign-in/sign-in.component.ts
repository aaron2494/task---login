import { Component, inject } from '@angular/core';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../data-access/auth.service';
import { Router, RouterLink } from '@angular/router';
import { hasEmailError, isRequired } from '../../utils/validators';
import { toast } from 'ngx-sonner';
import { GoogleButtonComponent } from '../../ui/google-button/google-button.component';



interface FormSignIn{
  password:FormControl<string|null>;
  email: FormControl<string|null>
}


@Component({
  selector: 'app-sign-in',
  standalone: true,
  imports: [ReactiveFormsModule,RouterLink,GoogleButtonComponent],
  templateUrl: './sign-in.component.html',
  styles: ``
})
export default class SignInComponent {
  private _formBuilder = inject (FormBuilder);
  private _authService =inject(AuthService);
  private _router = inject(Router);

  isRequired(field: "email"| "password"){
    return isRequired(field,this.form)
  }
  
  hasEmailError(){
    return hasEmailError(this.form);
  }

  form= this._formBuilder.group<FormSignIn>({
    password: this._formBuilder.control("",Validators.required),
    email: this._formBuilder.control("",[Validators.required,Validators.email]),
  })

async  submit(){
 if (this.form.invalid)return
try {
  const {email,password}=this.form.value;
  if(!email || !password)return;
  this._authService.signIn({email,password});
  this._router.navigateByUrl("/task")
  toast.success("hola nuevamente");
 
} catch (error) {
  toast.error("ocurrio un error");
}
  }
  async submitWithGoogle(){
    try {
      await this._authService.signInWithGoogle();
      toast.success("bienvenido");
  this._router.navigateByUrl("/task")
    } catch (error) {
      toast.error("ocurrio un error");
    }
  }
}
