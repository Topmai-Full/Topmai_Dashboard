import { ActionCategoryComponent } from './pages/categories/action-category/action-category.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// *******************************************************************************
// Layouts

import { Layout1Component } from './layout/layout-1/layout-1.component';

// *******************************************************************************
// Pages

import { Layout2Component } from './layout/layout-2/layout-2.component';
import { LoginGuard } from './Guard/login.guard';
import { LoginComponent } from './pages/Auth/login/login.component';
import { SignupComponent } from './pages/Auth/signup/signup.component';
import { AuthGuard } from './Guard/auth.guard';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { AllCategoriesComponent } from './pages/categories/all-categories/all-categories.component';
import { ContactUsComponent } from './pages/contact-us/contact-us.component';
import { ActionProductComponent } from './pages/products/action-product/action-product.component';
import { AllProductsComponent } from './pages/products/all-products/all-products.component';
import { UpdateProfileComponent } from './pages/profile/update-profile/update-profile.component';
import { AllOrdersComponent } from './pages/orders/all-orders/all-orders.component';

// *******************************************************************************
// Routes

const routes: Routes = [

  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  { path: 'login', component: LoginComponent, canActivate: [LoginGuard] },

  { path: 'signup', component: SignupComponent, canActivate: [LoginGuard] },


  {
    path: '', component: Layout2Component, children: [
      { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
      { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard] },
    ]
  },

  {
    path: '', component: Layout2Component, children: [
      { path: 'products', component: AllProductsComponent, canActivate: [AuthGuard] },
      { path: 'products/:id', component: ActionProductComponent, canActivate: [AuthGuard] },
    ]
  },


  {
    path: '', component: Layout2Component, children: [
      { path: 'category', component: AllCategoriesComponent, canActivate: [AuthGuard] },
      { path: 'category/:id', component: ActionCategoryComponent, canActivate: [AuthGuard] },
    ]
  },

  {
    path: '', component: Layout2Component, children: [
      { path: 'contact-us', component: ContactUsComponent, canActivate: [AuthGuard] },
    ]
  },

  {
    path: '', component: Layout2Component, children: [
      { path: 'update-profile', component: UpdateProfileComponent, canActivate: [AuthGuard] },
    ]
  },

  {
    path: '', component: Layout2Component, children: [
      { path: 'all-orders', component: AllOrdersComponent, canActivate: [AuthGuard] },
    ]
  },


];

// *******************************************************************************
//

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
