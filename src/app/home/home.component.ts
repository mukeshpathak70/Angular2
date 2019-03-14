import {Component} from '@angular/core';
import {ConfigService} from '../config/config.service'
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
@Component({
    selector:'app-root',
    styleUrls:['./home.component.css'],
    templateUrl:'./home.component.html'
})

export class Home {
    contactForm: FormGroup;
    constructor(private configService: ConfigService, private formBuilder: FormBuilder) { }
    public employeeData:any = [];
    public editEnabled:boolean = false;
    public selectedIndex:number = 0;
    ngOnInit() {
        debugger;
        this.configService.getConfig('../../assets/data/employees.json')
          .subscribe((data) => {
              this.employeeData = data
          });
      }
    openEdit(item,i) {
        debugger;
        this.editEnabled = true;
        this.selectedIndex = i;
        this.contactForm = this.formBuilder.group({
            fname: [item.firstName, Validators.required],
            lname: [item.lastName, Validators.required],
            email: [item.emailAddress, Validators.required],
            phone: [item.phoneNumber, Validators.required],
            region: [item.region, Validators.required],
            ecode: [item.employeeCode, [Validators.required]],
            jtitle: [item.jobTitleName, [Validators.required]]
          });
    }
    saveEditedDetails(){
        console.log(this.contactForm);
    }
}