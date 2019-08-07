import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { UserService } from '../shared/services/user.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {

  /* ATTRIBUTES */
  public pending: Boolean = false;
  public accepted: Boolean = false;
  public rejected: Boolean = false;

  filterParams = {
    isAccepted: false,
    isRejected: false
  };

  public users: any[];

  /* CONSTRUCTORS */

  /**
   * constructor
   * @param userService
   * @param route
   * @param userService
   * @param route
   */
  constructor(
    private userService: UserService,
    private route: ActivatedRoute
  ) {}

  /**
   * lifecycle
   */
  ngOnInit() {
    this.filterParams.isAccepted = this.route.snapshot.data['isAccepted'];
    this.filterParams.isRejected = this.route.snapshot.data['isRejected'];
    this.pending = !this.filterParams.isAccepted && !this.filterParams.isRejected;
    this.accepted = this.filterParams.isAccepted && !this.filterParams.isRejected;
    this.rejected = !this.filterParams.isAccepted && this.filterParams.isRejected;
    this.getUsers();

  }


  /**
   * Approve user
   * @param user
   */
  Approve(user) {
    user.isAccepted = true;
    user.isRejected = false;
    this.userService.updateUser(user).subscribe(
      () => {
        this.getUsers();
      },
      () => {}
    );
  }

  /**
   * reject user
   * @param user
   */
  Reject(user) {
    user.isAccepted = false;
    user.isRejected = true;
    this.userService.updateUser(user).subscribe(
      () => {
        this.getUsers();
      },
      () => {}
    );
  }

  /**
   * Get users
   */
  getUsers() {
    this.userService.getUsers(this.filterParams).subscribe(
      data => {
        this.users = data;
      },
      error => { console.log(error); }
    );
  }
}
