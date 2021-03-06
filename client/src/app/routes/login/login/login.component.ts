import { Component, OnInit } from '@angular/core';
import { IFormSchema, IWidgetSchema } from 'app/core/shared/_data/schema.model';
import { SecurityService, IUserCredential } from 'app/core/security.service';
import { environment } from './../../../../environments/environment';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
@Component({
  selector: 'ab-login',
  templateUrl: './login.component.html',
  styles: []
})
export class LoginComponent implements OnInit {
  loadedMetadata = false;
  loadingPanelSchema = {
    loading: true,
    empty: false
  };
  public panelSchema: IWidgetSchema;
  public formSchema: IFormSchema;

  constructor(private security: SecurityService, private http: Http) { }

  ngOnInit() {
    this.http
      .get('assets/schemas/login.json')
      .subscribe(res => {
        const schemas = res.json();
        this.panelSchema = schemas.panel;
        this.formSchema = schemas.form;
        this.loadedMetadata = true;
      });
  }

  onSend(credentials: IUserCredential) {
    this.security
      .logInUser(credentials);
  }

}


