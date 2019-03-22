import {Component} from '@angular/core';
import {ConfigService} from '../config/config.service'
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import CustomValidators from '../config/validation.service';
import Utils from '../config/utils.service';
@Component({selector: 'app-root', styleUrls: ['./home.component.css'], templateUrl: './home.component.html'})

export class Home {
    contactForm : FormGroup;
    constructor(private configService : ConfigService, private formBuilder : FormBuilder) {}
    public employeeData : any = []; //Main data
    public editEnabled : boolean = false; // Variable to show and hide create and edit 
    public newEmployeeEnabled : boolean = false; // Variable to detect edit or create
    public selectedIndex : number = 0; // variable to detect which row is bieng edited
    public copyEmployeeDataForSearch : string = "";//Variable to store data for search
    public sortType : string = "asc";//Variable for sorting type
    public selectedSortColumn : string = "lastName" // variable for storing column
    public validateForm : any = {
        firstName: true,
        lastName: true,
        emailAddress: true,
        phoneNumber: true,
        region: true,
        employeeCode: true,
        jobTitleName: true
    }//Object to show validation error

    /* function to be called on load */
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
    /* function to enable edit form */
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
                    item.phoneNumber,
                    [Validators.required, CustomValidators.validateNumber]
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
    /* function to open form forcreate new entry */
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
    /* function to save the form data */
    saveEditedDetails() {
        let controls = Object.keys(this.contactForm.controls);
        let validCount = 0;
        controls.forEach(formElements => {
            if (this.contactForm.controls[formElements].errors) {
                this.validateForm[formElements] = false;
                validCount++
            } else {
                this.validateForm[formElements] = true
            }
        });
        if (validCount) 
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
    /* function to delete the row */
    deleteEmployee(index) {
        if (this.editEnabled && this.selectedIndex == index) {
            alert("Cannot delete this row first close the edit form");
            return false
        }
        this
            .employeeData
            .splice(index, 1);
        this.copyEmployeeDataForSearch = JSON.stringify(this.employeeData);
    }
    /* function to search data*/
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
    /* function to sort data */
    sortTable(column) {
        if (this.selectedSortColumn == column) {
            if (this.sortType == "asc") {
                this.sortType = "dsc"
            } else {
                this.sortType = "asc"
            }
        } else {
            this.selectedSortColumn = column;
            this.sortType = "asc"
        }
        this.employeeData = Utils.sortTable(column, this.employeeData, this.sortType);
        console.log(this.employeeData)
    }
}