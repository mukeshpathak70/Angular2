import {Component} from '@angular/core';
import {ConfigService} from '../config/config.service'
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import CustomValidators from '../config/validation.service';
import Utils from '../config/utils.service';
@Component({selector: 'app-root', styleUrls: ['./home.component.css'], templateUrl: './home.component.html'})

export class Home {
    contactForm : FormGroup;
    constructor(private configService : ConfigService, private formBuilder : FormBuilder) {}
    public employeeData : any = [];
    public editEnabled : boolean = false;
    public newEmployeeEnabled : boolean = false;
    public selectedIndex : number = 0;
    public copyEmployeeDataForSearch : string = "";
    public sortType : string = "asc";
    public selectedSortColumn : string = "lastName"
    public validateForm : any = {
        firstName: true,
        lastName: true,
        emailAddress: true,
        phoneNumber: true,
        region: true,
        employeeCode: true,
        jobTitleName: true
    }
    ngOnInit() {
        this
            .configService
            .getConfig('../../assets/data/employees.json')
            .subscribe((data) => {
                this.employeeData = data;
                this.copyEmployeeDataForSearch = JSON.stringify(data);
                this.sortTable('firstName')
            });
    }
    openEdit(item, i) {
        this.editEnabled = true;
        this.selectedIndex = i;
        this.contactForm = this
            .formBuilder
            .group({
                firstName: [
                    item.firstName, Validators.required
                ],
                lastName: [
                    item.lastName, Validators.required
                ],
                emailAddress: [
                    item.emailAddress,
                    [Validators.required, CustomValidators.validateEmail]
                ],
                phoneNumber: [
                    item.phoneNumber, [Validators.required, CustomValidators.validateNumber]
                ],
                region: [
                    item.region, Validators.required
                ],
                employeeCode: [
                    item.employeeCode,
                    [Validators.required]
                ],
                jobTitleName: [
                    item.jobTitleName,
                    [Validators.required]
                ]
            });
    }
    openNewEmployee() {
        this.editEnabled = true;
        this.newEmployeeEnabled = true;
        this.contactForm = this
            .formBuilder
            .group({
                firstName: [
                    "", Validators.required
                ],
                lastName: [
                    "", Validators.required
                ],
                emailAddress: [
                    "", Validators.required
                ],
                phoneNumber: [
                    "", Validators.required
                ],
                region: [
                    "", Validators.required
                ],
                employeeCode: [
                    "",
                    [Validators.required]
                ],
                jobTitleName: [
                    "",
                    [Validators.required]
                ]
            });
    }
    saveEditedDetails() {
        let controls = Object.keys(this.contactForm.controls);
        let validCount = 0;
        controls.forEach(formElements => {
            if (this.contactForm.controls[formElements].errors) {
                this.validateForm[formElements] = false;
                validCount++
            }else{
                this.validateForm[formElements]=true
            }
        });
        if(validCount)
            return false;
        if (!this.newEmployeeEnabled) {
            this.editEnabled = false;
            this.employeeData[this.selectedIndex] = this.contactForm.value
        } else {
            this.editEnabled = false;
            this
                .employeeData
                .push(this.contactForm.value)
        }
    };
    deleteEmployee(index) {
        if (this.editEnabled && this.selectedIndex == index) {
            alert("Cannot delete this row first close the edit form");
            return false
        }
        this
            .employeeData
            .splice(index, 1);
    }
    searchEmployee(value) {
        let dataForSearch = JSON.parse(this.copyEmployeeDataForSearch);
        dataForSearch = dataForSearch.filter(employee => {
            return JSON
                .stringify(employee)
                .toUpperCase()
                .indexOf(value.toUpperCase()) >= 0
        });
        this.employeeData = dataForSearch;
    }
    sortTable(column){
        if(this.selectedSortColumn == column){
            if(this.sortType == "asc"){
                this.sortType = "dsc"
            }else{
                this.sortType = "asc"
            }
        }else{
            this.selectedSortColumn = column;
            this.sortType = "asc"
        }
        this.employeeData = Utils.sortTable(column,this.employeeData, this.sortType);
        console.log(this.employeeData)
    }
}