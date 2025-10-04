import { Component, OnInit } from '@angular/core';
import { ThemeConstantService } from '../../services/theme-constant.service';
// third-party
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { FormsModule } from '@angular/forms';
@Component({
    selector: 'app-quick-view',
    templateUrl: './quick-view.component.html',
    imports: [
        // ng
        FormsModule,
        // third-party
        NzDividerModule,
        NzSwitchModule,
        NzRadioModule,
    ]
})


export class QuickViewComponent implements OnInit {

    selectedHeaderColor!: string;
    isSideNavDark!: boolean;
    isFolded!: boolean;

    constructor(private themeService: ThemeConstantService) { }

    ngOnInit(): void {
        this.themeService.isMenuFoldedChanges.subscribe(isFolded => this.isFolded = isFolded);
        this.themeService.isSideNavDarkChanges.subscribe(isDark => this.isSideNavDark = isDark);
        this.themeService.selectedHeaderColor.subscribe(color => this.selectedHeaderColor = color);
    }

    changeHeaderColor() {
        this.themeService.changeHeaderColor(this.selectedHeaderColor)
    }

    toggleSideNavDark() {
        this.themeService.toogleSideNavDark(this.isSideNavDark);
    }

    toggleFold() {
        this.themeService.toggleFold(this.isFolded);
    }
}

