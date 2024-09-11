import {Component} from '@angular/core';
import {UserService} from "../../../../api-service/service/UserService";
import {ApiResultFormatModel} from "../../../../api-service/model/common/ApiResultFormatModel";
import {UserModel} from "../../../../api-service/model/UserModel";
import {PrivilegeService} from 'src/api-service/service/PrivilegeService';
import Swal from 'sweetalert2';
import {RoleService} from "../../../../api-service/service/RoleService";
import {RoleModel} from "../../../../api-service/model/RoleModel";


@Component({
  selector: 'app-user-privilege',
  templateUrl: './user-privilege.component.html',
  styleUrls: ['./user-privilege.component.scss']
})
export class UserPrivilegeComponent {
  public privilegeList: any[] = [];
  public roleWisePrivilegeList: any[] = [];
  public checkedIds: number[] = [];
  public unCheckedIds: number[] = [];
  public tempIdList: number[] = [];
  public selecteRole!: string;
  public userRoles: Array<RoleModel> = [];

  public showSubmitButton = false;
  public emptyUserPrivileges = false;
  public disableSubmitBtn = false;



  constructor(private privilegeService: PrivilegeService,
              private roleService: RoleService) {
    this.getAllPrivilagesList();
    this.getAllRollList()

  }


  getAllRollList() {
    this.roleService.getAllRollList().subscribe((response: ApiResultFormatModel) => {
      if (response.statusCode === 200) {
        this.userRoles = response.data;
      }
    });
  }

  getAllPrivilagesList() {
    this.privilegeService.getAllPrivileges().subscribe((response: ApiResultFormatModel) => {
      if (response.statusCode === 200) {
        this.privilegeList = response.data;
      }
    });
  }

  setRoleSingleValue(value: string) {
    this.resetLists();
    this.selecteRole = value;
    const payload = { role: value };

    this.privilegeService.getRoleWisePrivilege(payload).subscribe(
      (response: ApiResultFormatModel) => {
        if (response.statusCode === 200) {
          this.roleWisePrivilegeList = response.data;
          this.emptyUserPrivileges = this.roleWisePrivilegeList.length === 0;
        } else {
          this.emptyUserPrivileges = true;
        }
      },
      () => {
        this.emptyUserPrivileges = true;
      }
    );
  }


  isPrivilegeChecked(privilegeId: number): boolean {
    return this.roleWisePrivilegeList.some(item => item.privilegeId === privilegeId);
  }





  togglePrivilegeCheckbox(event: any, data: any) {
    const hasPrivilageId = this.tempIdList.some(num => num === data.privilegeId);
      // ||
      // this.userWisePrivilegeList.some(item => item.privilegeId === data.privilegeId);

    if (!hasPrivilageId) {
      // id not in list
      this.tempIdList.push(data.privilegeId)

      if (event.target.checked) {
        this.checkedIds.push(data.privilegeId)
      } else {
        this.unCheckedIds.push(data.privilegeId)
      }

    } else {
      if (event.target.checked) {
        this.unCheckedIds = this.unCheckedIds.filter(num => num !== data.privilegeId);
      } else {
        this.checkedIds = this.checkedIds.filter(num => num !== data.privilegeId);
      }
    }


    // Show the submit button if any changes are made
    this.showSubmitButton = this.checkedIds.length > 0 || this.unCheckedIds.length > 0;

    console.log('checked list', this.checkedIds);
    console.log('unchecked list', this.unCheckedIds);
  }




  submitPrivileges() {
    let checkedListBool = false;
    let unCheckedListBool = false;
    this.disableSubmitBtn = true;

    // select check box save
    if (this.checkedIds.length > 0) {
      const payload = {
        role: this.selecteRole,
        privilegeIds: this.checkedIds,
        status: 1
      };

      this.privilegeService.assignPrivileges(payload).subscribe((value: ApiResultFormatModel) => {
        if (value.statusCode == 200) {
          checkedListBool = true;
        }
      });
    }

    // un select chck box save
    if (this.unCheckedIds.length > 0) {
      const payload = {
        role: this.selecteRole,
        privilegeIds: this.unCheckedIds,
        status: 0
      };

      this.privilegeService.assignPrivileges(payload).subscribe((value: ApiResultFormatModel) => {
        if (value.statusCode == 200) {
          unCheckedListBool = true;
        }
      });
    }

    setTimeout(() => {
      if (checkedListBool || unCheckedListBool) {
        Swal.fire({
          title: '',
          text: 'Privilege Updated!',
          icon: 'success',
          confirmButtonText: 'OK',
          allowOutsideClick: false,
          showConfirmButton: true
        }).then((result) => {
          if (result.isConfirmed) {
            this.resetLists();
            this.setRoleSingleValue(this.selecteRole);
            this.disableSubmitBtn = false;
            window.scrollTo({ top: 0 });
            // Hide the submit button after submission
            this.showSubmitButton = false;
          }
        });
      }
    }, 3000);
  }




  resetLists() {
    this.roleWisePrivilegeList = [];
    this.tempIdList = [];
    this.checkedIds = [];
    this.unCheckedIds = [];
    this.emptyUserPrivileges = false;
  }


}
