
// import { Component, OnInit } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { FormsModule } from '@angular/forms';
// import { Router, RouterLink } from '@angular/router';
// import { ApiService } from '../../services/api';

// @Component({
//   selector: 'app-dashboard',
//   standalone: true,
//   imports: [CommonModule, FormsModule, RouterLink],
//   templateUrl: './dashboard.html',
//   styleUrls: ['./dashboard.css']
// })
// export class DashboardComponent implements OnInit {

//   activeTab = 'overview';

//   userName = 'Guest';
//   email = '';

//   websites: any[] = [];
//   selectedId: number | null = null;
//   selectedDomain = '';

//   websiteUrl = '';
//   showAdd = false;
//   adding = false;

//   message = '';
//   messageType = '';

//   seoScore = 0;
//   speed = 0;
//   performanceStatus = 'No data';

//   // FIXED: dashboard.html uses auditStatus
//   auditStatus = 'Not analyzed';

//   pageCount = 0;

//   audit: any = null;
//   auditSuggestions: string[] = [];

//   performanceHistory: any[] = [];

//   keywords: any[] = [];
//   suggestions: string[] = [];
//   keywordInput = '';

//   constructor(
//     private api: ApiService,
//     private router: Router
//   ) {}

//   get heading() {
//     return ({
//       overview: 'Workspace overview',
//       websites: 'Websites',
//       keywords: 'Keyword intelligence',
//       audit: 'SEO audit',
//       performance: 'Performance'
//     } as any)[this.activeTab] || 'Workspace';
//   }

//   get subheading() {
//     return ({
//       overview: 'A clear view of your website health and recent activity.',
//       websites: 'Manage the domains connected to your workspace.',
//       keywords: 'Find and track terms worth targeting.',
//       audit: 'Turn technical checks into practical fixes.',
//       performance: 'Monitor the signals that affect user experience.'
//     } as any)[this.activeTab] || '';
//   }

//   get nextActionTitle() {
//     if (!this.selectedId) {
//       return 'Add your first website';
//     }

//     if (!this.audit) {
//       return 'Run your first SEO audit';
//     }

//     if (!this.performanceHistory.length) {
//       return 'Check site performance';
//     }

//     return 'Crawl fresh pages';
//   }

//   get nextActionText() {
//     if (!this.selectedId) {
//       return 'Connect a domain to unlock audits, keywords, crawling and reports.';
//     }

//     if (!this.audit) {
//       return `Analyze ${this.selectedDomain} for title, meta, headings and image issues.`;
//     }

//     if (!this.performanceHistory.length) {
//       return 'Measure the current performance score and save it to your project history.';
//     }

//     return 'Discover new pages and keep your page inventory up to date.';
//   }

//   get nextActionButton() {
//     if (!this.selectedId) {
//       return 'Add website';
//     }

//     if (!this.audit) {
//       return 'Run audit';
//     }

//     if (!this.performanceHistory.length) {
//       return 'Check performance';
//     }

//     return 'Open project';
//   }

//   ngOnInit() {
//     if (!localStorage.getItem('token')) {
//       this.router.navigate(['/login']);
//       return;
//     }

//     this.userName = localStorage.getItem('username') || 'Guest';
//     this.email = localStorage.getItem('email') || '';

//     const id = Number(localStorage.getItem('currentWebsiteId'));

//     this.selectedId = id || null;

//     this.loadAll();
//   }

//   setTab(tab: string) {
//     this.activeTab = tab;

//     if (tab === 'keywords' && this.selectedId) {
//       this.loadKeywords();
//     }

//     if (tab === 'performance' && this.selectedId) {
//       this.loadPerformance();
//     }
//   }

//   loadAll() {
//     this.api.getWebsites().subscribe({
//       next: (response: any) => {

//         this.websites = response || [];

//         if (!this.selectedId && this.websites.length) {
//           this.selectWebsite(this.websites[0].id);
//         } else if (this.selectedId) {
//           this.hydrate();
//         }
//       },

//       error: () => {
//         this.notify(
//           'Session expired or API unavailable.',
//           'error'
//         );
//       }
//     });
//   }

//   hydrate() {

//     const website = this.websites.find(
//       item => item.id === this.selectedId
//     );

//     if (!website) {
//       this.selectedId = null;
//       return;
//     }

//     this.selectedDomain = website.domain;

//     this.api.getPages(this.selectedId!).subscribe({
//       next: (response: any) => {
//         this.pageCount = (response || []).length;
//       },

//       error: () => {
//         this.pageCount = 0;
//       }
//     });

//     this.api.getAuditHistory(this.selectedId!).subscribe({
//       next: (response: any) => {

//         if (response?.length) {

//           this.audit = response[0];

//           this.seoScore = response[0].seo_score || 0;

//           this.auditStatus = 'Completed';

//           this.auditSuggestions =
//             this.buildSuggestions(response[0]);

//         } else {

//           this.audit = null;

//           this.auditStatus = 'Not analyzed';

//         }
//       },

//       error: () => {
//         this.audit = null;
//         this.auditStatus = 'Not analyzed';
//       }
//     });

//     this.loadPerformance();
//     this.loadKeywords();
//   }

//   selectWebsite(id: number) {

//     this.selectedId = id;

//     localStorage.setItem(
//       'currentWebsiteId',
//       String(id)
//     );

//     this.hydrate();

//     this.notify(
//       'Project selected',
//       'ok'
//     );
//   }

//   domainInitial(domain: string) {

//     return (domain || 'W')
//       .replace(/^https?:\/\//, '')
//       .charAt(0)
//       .toUpperCase();
//   }

//   openAdd() {

//     this.websiteUrl = '';
//     this.showAdd = true;
//   }

//   addWebsite() {

//     if (!this.websiteUrl.trim()) {
//       return;
//     }

//     let domain = this.websiteUrl.trim();

//     if (!/^https?:\/\//i.test(domain)) {
//       domain = 'https://' + domain;
//     }

//     this.adding = true;

//     this.api.addWebsite({ domain }).subscribe({

//       next: (website: any) => {

//         this.websites = [
//           ...this.websites,
//           website
//         ];

//         this.showAdd = false;
//         this.adding = false;

//         this.selectWebsite(website.id);

//         this.notify(
//           'Website project created',
//           'ok'
//         );
//       },

//       error: (error: any) => {

//         this.adding = false;

//         this.notify(
//           error?.error?.domain?.[0] ||
//           'Could not add this website.',
//           'error'
//         );
//       }
//     });
//   }

//   deleteWebsite(id: number) {

//     if (!confirm(
//       'Delete this website and its project data?'
//     )) {
//       return;
//     }

//     this.api.deleteWebsite(id).subscribe({

//       next: () => {

//         this.websites =
//           this.websites.filter(
//             website => website.id !== id
//           );

//         if (this.selectedId === id) {

//           this.selectedId = null;

//           localStorage.removeItem(
//             'currentWebsiteId'
//           );

//           this.audit = null;
//           this.auditStatus = 'Not analyzed';
//           this.seoScore = 0;
//           this.pageCount = 0;
//         }

//         this.notify(
//           'Website removed',
//           'ok'
//         );
//       },

//       error: () => {
//         this.notify(
//           'Could not delete website.',
//           'error'
//         );
//       }
//     });
//   }

//   runPrimaryAction() {

//     if (!this.selectedId) {
//       this.openAdd();
//       return;
//     }

//     if (!this.audit) {
//       this.runAudit();
//       return;
//     }

//     if (!this.performanceHistory.length) {
//       this.runPerformance();
//       return;
//     }

//     this.setTab('websites');
//   }

//   runAudit() {

//     if (!this.selectedId) {
//       return;
//     }

//     this.auditStatus = 'Analyzing...';

//     this.api.analyzeSEO(this.selectedId).subscribe({

//       next: (response: any) => {

//         this.audit =
//           response.audit || response;

//         this.seoScore =
//           this.audit.seo_score || 0;

//         this.auditSuggestions =
//           response.suggestions ||
//           this.buildSuggestions(this.audit);

//         this.auditStatus = 'Completed';

//         this.notify(
//           'SEO audit completed',
//           'ok'
//         );
//       },

//       error: (error: any) => {

//         this.auditStatus = 'Failed';

//         this.notify(
//           error?.error?.error ||
//           'Audit failed. Check that the site is reachable.',
//           'error'
//         );
//       }
//     });
//   }

//   buildSuggestions(audit: any) {

//     const suggestions: string[] = [];

//     if (!audit?.title) {
//       suggestions.push(
//         'Add a descriptive title tag.'
//       );
//     }

//     if (!audit?.meta_description) {
//       suggestions.push(
//         'Add a useful meta description.'
//       );
//     }

//     if (!audit?.has_h1) {
//       suggestions.push(
//         'Add one clear H1 heading.'
//       );
//     }

//     if ((audit?.images_missing_alt || 0) > 0) {

//       suggestions.push(
//         `Add alt text to ${audit.images_missing_alt} image(s).`
//       );
//     }

//     return suggestions;
//   }

//   runPerformance() {

//     if (!this.selectedId) {
//       return;
//     }

//     this.api.checkPerformance(this.selectedId).subscribe({

//       next: (response: any) => {

//         this.speed =
//           response.speed || 0;

//         this.seoScore =
//           response.seo_score ||
//           this.seoScore;

//         this.performanceStatus =
//           response.status ||
//           'checked';

//         this.loadPerformance();

//         this.notify(
//           'Performance check completed',
//           'ok'
//         );
//       },

//       error: (error: any) => {

//         this.notify(
//           error?.error?.error ||
//           'Performance check failed.',
//           'error'
//         );
//       }
//     });
//   }

//   loadPerformance() {

//     if (!this.selectedId) {
//       return;
//     }

//     this.api.getPerformanceHistory(
//       this.selectedId
//     ).subscribe({

//       next: (response: any) => {

//         this.performanceHistory =
//           response || [];

//         if (this.performanceHistory.length) {

//           const latest =
//             this.performanceHistory[0];

//           this.speed =
//             latest.speed || 0;

//           this.performanceStatus =
//             latest.status || 'checked';

//           if (!this.seoScore) {

//             this.seoScore =
//               latest.seo_score || 0;
//           }
//         }
//       },

//       error: () => {
//         this.performanceHistory = [];
//       }
//     });
//   }

//   loadKeywords() {

//     if (!this.selectedId) {
//       return;
//     }

//     this.api.getKeywords(
//       this.selectedId
//     ).subscribe({

//       next: (response: any) => {
//         this.keywords = response || [];
//       },

//       error: () => {
//         this.keywords = [];
//       }
//     });
//   }

//   suggestKeywords() {

//     if (
//       !this.selectedId ||
//       this.keywordInput.trim().length < 2
//     ) {
//       return;
//     }

//     this.api.getKeywordSuggestions({

//       website_id: this.selectedId,

//       keyword:
//         this.keywordInput.trim()

//     }).subscribe({

//       next: (response: any) => {

//         this.suggestions =
//           response.suggestions ||
//           response.saved_keywords ||
//           [];

//         this.loadKeywords();

//         this.notify(
//           'Keyword suggestions generated',
//           'ok'
//         );
//       },

//       error: () => {

//         this.notify(
//           'Could not generate suggestions.',
//           'error'
//         );
//       }
//     });
//   }

//   saveKeyword() {

//     this.saveKeywordValue(
//       this.keywordInput.trim()
//     );
//   }

//   saveKeywordValue(keyword: string) {

//     if (!this.selectedId || !keyword) {
//       return;
//     }

//     this.api.addKeyword({

//       website_id: this.selectedId,

//       keyword: keyword

//     }).subscribe({

//       next: () => {

//         this.keywordInput = '';

//         this.loadKeywords();

//         this.notify(
//           `Tracking “${keyword}”`,
//           'ok'
//         );
//       },

//       error: () => {

//         this.notify(
//           'Keyword could not be saved.',
//           'error'
//         );
//       }
//     });
//   }

//   notify(
//     message: string,
//     type: string
//   ) {

//     this.message = message;
//     this.messageType = type;

//     setTimeout(() => {
//       this.message = '';
//     }, 3200);
//   }

//   logout() {

//     localStorage.clear();

//     this.router.navigate([
//       '/login'
//     ]);
//   }
// }




// import { Component, OnInit } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { FormsModule } from '@angular/forms';
// import { Router, RouterLink } from '@angular/router';
// import { ApiService } from '../../services/api';

// @Component({
//   selector: 'app-dashboard',
//   standalone: true,
//   imports: [CommonModule, FormsModule, RouterLink],
//   templateUrl: './dashboard.html',
//   styleUrls: ['./dashboard.css']
// })
// export class DashboardComponent implements OnInit {

//   activeTab = 'overview';

//   userName = 'Guest';
//   email = '';

//   websites: any[] = [];
//   selectedId: number | null = null;
//   selectedDomain = '';

//   websiteUrl = '';
//   showAdd = false;
//   adding = false;

//   message = '';
//   messageType = '';

//   seoScore = 0;
//   speed = 0;
//   performanceStatus = 'No data';

//   auditStatus = 'Not analyzed';

//   pageCount = 0;

//   audit: any = null;
//   auditSuggestions: string[] = [];

//   performanceHistory: any[] = [];

//   keywords: any[] = [];
//   suggestions: string[] = [];
//   keywordInput = '';

//   constructor(
//     private api: ApiService,
//     private router: Router
//   ) {}

//   get heading() {
//     return ({
//       overview: 'Workspace overview',
//       websites: 'Websites',
//       keywords: 'Keyword intelligence',
//       audit: 'SEO audit',
//       performance: 'Performance',
//       reports: 'Reports'
//     } as any)[this.activeTab] || 'Workspace';
//   }

//   get subheading() {
//     return ({
//       overview: 'A clear view of your website health and recent activity.',
//       websites: 'Manage the domains connected to your workspace.',
//       keywords: 'Find and track terms worth targeting.',
//       audit: 'Turn technical checks into practical fixes.',
//       performance: 'Monitor the signals that affect user experience.',
//       reports: 'Generate and download SEO reports for your website.'
//     } as any)[this.activeTab] || '';
//   }

//   get nextActionTitle() {
//     if (!this.selectedId) {
//       return 'Add your first website';
//     }

//     if (!this.audit) {
//       return 'Run your first SEO audit';
//     }

//     if (!this.performanceHistory.length) {
//       return 'Check site performance';
//     }

//     return 'Crawl fresh pages';
//   }

//   get nextActionText() {
//     if (!this.selectedId) {
//       return 'Connect a domain to unlock audits, keywords, crawling and reports.';
//     }

//     if (!this.audit) {
//       return `Analyze ${this.selectedDomain} for title, meta, headings and image issues.`;
//     }

//     if (!this.performanceHistory.length) {
//       return 'Measure the current performance score and save it to your project history.';
//     }

//     return 'Discover new pages and keep your page inventory up to date.';
//   }

//   get nextActionButton() {
//     if (!this.selectedId) {
//       return 'Add website';
//     }

//     if (!this.audit) {
//       return 'Run audit';
//     }

//     if (!this.performanceHistory.length) {
//       return 'Check performance';
//     }

//     return 'Open project';
//   }

//   ngOnInit() {
//     if (!localStorage.getItem('token')) {
//       this.router.navigate(['/login']);
//       return;
//     }

//     this.userName = localStorage.getItem('username') || 'Guest';
//     this.email = localStorage.getItem('email') || '';

//     const id = Number(
//       localStorage.getItem('currentWebsiteId')
//     );

//     this.selectedId = id || null;

//     this.loadAll();
//   }

//   setTab(tab: string) {
//     this.activeTab = tab;

//     if (tab === 'keywords' && this.selectedId) {
//       this.loadKeywords();
//     }

//     if (tab === 'performance' && this.selectedId) {
//       this.loadPerformance();
//     }
//   }

//   loadAll() {
//     this.api.getWebsites().subscribe({
//       next: (response: any) => {

//         this.websites = response || [];

//         if (!this.selectedId && this.websites.length) {
//           this.selectWebsite(this.websites[0].id);
//         } else if (this.selectedId) {
//           this.hydrate();
//         }
//       },

//       error: () => {
//         this.notify(
//           'Session expired or API unavailable.',
//           'error'
//         );
//       }
//     });
//   }

//   hydrate() {

//     const website = this.websites.find(
//       item => item.id === this.selectedId
//     );

//     if (!website) {
//       this.selectedId = null;
//       return;
//     }

//     this.selectedDomain = website.domain;

//     this.api.getPages(this.selectedId!).subscribe({
//       next: (response: any) => {
//         this.pageCount = (response || []).length;
//       },

//       error: () => {
//         this.pageCount = 0;
//       }
//     });

//     this.api.getAuditHistory(this.selectedId!).subscribe({
//       next: (response: any) => {

//         if (response?.length) {

//           this.audit = response[0];

//           this.seoScore =
//             response[0].seo_score || 0;

//           this.auditStatus = 'Completed';

//           this.auditSuggestions =
//             this.buildSuggestions(response[0]);

//         } else {

//           this.audit = null;

//           this.auditStatus = 'Not analyzed';
//         }
//       },

//       error: () => {
//         this.audit = null;
//         this.auditStatus = 'Not analyzed';
//       }
//     });

//     this.loadPerformance();
//     this.loadKeywords();
//   }

//   selectWebsite(id: number) {

//     this.selectedId = id;

//     localStorage.setItem(
//       'currentWebsiteId',
//       String(id)
//     );

//     this.hydrate();

//     this.notify(
//       'Project selected',
//       'ok'
//     );
//   }

//   domainInitial(domain: string) {

//     return (domain || 'W')
//       .replace(/^https?:\/\//, '')
//       .charAt(0)
//       .toUpperCase();
//   }

//   openAdd() {

//     this.websiteUrl = '';
//     this.showAdd = true;
//   }

//   addWebsite() {

//     if (!this.websiteUrl.trim()) {
//       return;
//     }

//     let domain = this.websiteUrl.trim();

//     if (!/^https?:\/\//i.test(domain)) {
//       domain = 'https://' + domain;
//     }

//     this.adding = true;

//     this.api.addWebsite({ domain }).subscribe({

//       next: (website: any) => {

//         this.websites = [
//           ...this.websites,
//           website
//         ];

//         this.showAdd = false;
//         this.adding = false;

//         this.selectWebsite(website.id);

//         this.notify(
//           'Website project created',
//           'ok'
//         );
//       },

//       error: (error: any) => {

//         this.adding = false;

//         this.notify(
//           error?.error?.domain?.[0] ||
//           'Could not add this website.',
//           'error'
//         );
//       }
//     });
//   }

//   deleteWebsite(id: number) {

//     if (!confirm(
//       'Delete this website and its project data?'
//     )) {
//       return;
//     }

//     this.api.deleteWebsite(id).subscribe({

//       next: () => {

//         this.websites =
//           this.websites.filter(
//             website => website.id !== id
//           );

//         if (this.selectedId === id) {

//           this.selectedId = null;

//           localStorage.removeItem(
//             'currentWebsiteId'
//           );

//           this.audit = null;
//           this.auditStatus = 'Not analyzed';
//           this.seoScore = 0;
//           this.pageCount = 0;
//         }

//         this.notify(
//           'Website removed',
//           'ok'
//         );
//       },

//       error: () => {

//         this.notify(
//           'Could not delete website.',
//           'error'
//         );
//       }
//     });
//   }

//   runPrimaryAction() {

//     if (!this.selectedId) {
//       this.openAdd();
//       return;
//     }

//     if (!this.audit) {
//       this.runAudit();
//       return;
//     }

//     if (!this.performanceHistory.length) {
//       this.runPerformance();
//       return;
//     }

//     this.setTab('websites');
//   }

//   runAudit() {

//     if (!this.selectedId) {
//       return;
//     }

//     this.auditStatus = 'Analyzing...';

//     this.api.analyzeSEO(this.selectedId).subscribe({

//       next: (response: any) => {

//         this.audit =
//           response.audit || response;

//         this.seoScore =
//           this.audit.seo_score || 0;

//         this.auditSuggestions =
//           response.suggestions ||
//           this.buildSuggestions(this.audit);

//         this.auditStatus = 'Completed';

//         this.notify(
//           'SEO audit completed',
//           'ok'
//         );
//       },

//       error: (error: any) => {

//         this.auditStatus = 'Failed';

//         this.notify(
//           error?.error?.error ||
//           'Audit failed. Check that the site is reachable.',
//           'error'
//         );
//       }
//     });
//   }

//   buildSuggestions(audit: any) {

//     const suggestions: string[] = [];

//     if (!audit?.title) {
//       suggestions.push(
//         'Add a descriptive title tag.'
//       );
//     }

//     if (!audit?.meta_description) {
//       suggestions.push(
//         'Add a useful meta description.'
//       );
//     }

//     if (!audit?.has_h1) {
//       suggestions.push(
//         'Add one clear H1 heading.'
//       );
//     }

//     if ((audit?.images_missing_alt || 0) > 0) {

//       suggestions.push(
//         `Add alt text to ${audit.images_missing_alt} image(s).`
//       );
//     }

//     return suggestions;
//   }

//   runPerformance() {

//     if (!this.selectedId) {
//       return;
//     }

//     this.api.checkPerformance(this.selectedId).subscribe({

//       next: (response: any) => {

//         this.speed =
//           response.speed || 0;

//         this.seoScore =
//           response.seo_score ||
//           this.seoScore;

//         this.performanceStatus =
//           response.status ||
//           'checked';

//         this.loadPerformance();

//         this.notify(
//           'Performance check completed',
//           'ok'
//         );
//       },

//       error: (error: any) => {

//         this.notify(
//           error?.error?.error ||
//           'Performance check failed.',
//           'error'
//         );
//       }
//     });
//   }

//   loadPerformance() {

//     if (!this.selectedId) {
//       return;
//     }

//     this.api.getPerformanceHistory(
//       this.selectedId
//     ).subscribe({

//       next: (response: any) => {

//         this.performanceHistory =
//           response || [];

//         if (this.performanceHistory.length) {

//           const latest =
//             this.performanceHistory[0];

//           this.speed =
//             latest.speed || 0;

//           this.performanceStatus =
//             latest.status || 'checked';

//           if (!this.seoScore) {

//             this.seoScore =
//               latest.seo_score || 0;
//           }
//         }
//       },

//       error: () => {
//         this.performanceHistory = [];
//       }
//     });
//   }

//   loadKeywords() {

//     if (!this.selectedId) {
//       return;
//     }

//     this.api.getKeywords(
//       this.selectedId
//     ).subscribe({

//       next: (response: any) => {
//         this.keywords = response || [];
//       },

//       error: () => {
//         this.keywords = [];
//       }
//     });
//   }

//   suggestKeywords() {

//     if (
//       !this.selectedId ||
//       this.keywordInput.trim().length < 2
//     ) {
//       return;
//     }

//     this.api.getKeywordSuggestions({

//       website_id: this.selectedId,

//       keyword:
//         this.keywordInput.trim()

//     }).subscribe({

//       next: (response: any) => {

//         this.suggestions =
//           response.suggestions ||
//           response.saved_keywords ||
//           [];

//         this.loadKeywords();

//         this.notify(
//           'Keyword suggestions generated',
//           'ok'
//         );
//       },

//       error: () => {

//         this.notify(
//           'Could not generate suggestions.',
//           'error'
//         );
//       }
//     });
//   }

//   saveKeyword() {

//     this.saveKeywordValue(
//       this.keywordInput.trim()
//     );
//   }

//   saveKeywordValue(keyword: string) {

//     if (!this.selectedId || !keyword) {
//       return;
//     }

//     this.api.addKeyword({

//       website_id: this.selectedId,

//       keyword: keyword

//     }).subscribe({

//       next: () => {

//         this.keywordInput = '';

//         this.loadKeywords();

//         this.notify(
//           `Tracking “${keyword}”`,
//           'ok'
//         );
//       },

//       error: () => {

//         this.notify(
//           'Keyword could not be saved.',
//           'error'
//         );
//       }
//     });
//   }

//   // =========================
//   // REPORTS
//   // =========================

//   downloadPDF() {

//     if (!this.selectedId) {
//       this.notify(
//         'Select a website first.',
//         'error'
//       );
//       return;
//     }

//     this.api.downloadPDF(
//       this.selectedId
//     );
//   }

//   downloadCSV() {

//     if (!this.selectedId) {
//       this.notify(
//         'Select a website first.',
//         'error'
//       );
//       return;
//     }

//     this.api.downloadCSV(
//       this.selectedId
//     );
//   }

//   notify(
//     message: string,
//     type: string
//   ) {

//     this.message = message;
//     this.messageType = type;

//     setTimeout(() => {
//       this.message = '';
//     }, 3200);
//   }

//   logout() {

//     localStorage.clear();

//     this.router.navigate([
//       '/login'
//     ]);
//   }
// }




import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ApiService } from '../../services/api';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css']
})
export class DashboardComponent implements OnInit {

  activeTab = 'overview';

  userName = 'Guest';
  email = '';

  websites: any[] = [];
  selectedId: number | null = null;
  selectedDomain = '';

  websiteUrl = '';
  showAdd = false;
  adding = false;

  message = '';
  messageType = '';

  seoScore = 0;
  speed = 0;
  performanceStatus = 'No data';

  auditStatus = 'Not analyzed';

  pageCount = 0;

  audit: any = null;
  auditSuggestions: string[] = [];

  performanceHistory: any[] = [];

  performanceChartDots: {
    x: number;
    y: number;
    score: number;
    label: string;
  }[] = [];

  performanceAreaPoints = '';
  performanceLinePoints = '';

  keywords: any[] = [];
  suggestions: string[] = [];
  keywordInput = '';

  constructor(
    private api: ApiService,
    private router: Router
  ) {}

  get heading() {
    return ({
      overview: 'Workspace overview',
      websites: 'Websites',
      keywords: 'Keyword intelligence',
      audit: 'SEO audit',
      performance: 'Performance',
      reports: 'Reports'
    } as any)[this.activeTab] || 'Workspace';
  }

  get subheading() {
    return ({
      overview: 'A clear view of your website health and recent activity.',
      websites: 'Manage the domains connected to your workspace.',
      keywords: 'Find and track terms worth targeting.',
      audit: 'Turn technical checks into practical fixes.',
      performance: 'Monitor the signals that affect user experience.',
      reports: 'Generate and download SEO reports for your website.'
    } as any)[this.activeTab] || '';
  }

  get nextActionTitle() {
    if (!this.selectedId) {
      return 'Add your first website';
    }

    if (!this.audit) {
      return 'Run your first SEO audit';
    }

    if (!this.performanceHistory.length) {
      return 'Check site performance';
    }

    return 'Crawl fresh pages';
  }

  get nextActionText() {
    if (!this.selectedId) {
      return 'Connect a domain to unlock audits, keywords, crawling and reports.';
    }

    if (!this.audit) {
      return `Analyze ${this.selectedDomain} for title, meta, headings and image issues.`;
    }

    if (!this.performanceHistory.length) {
      return 'Measure the current performance score and save it to your project history.';
    }

    return 'Discover new pages and keep your page inventory up to date.';
  }

  get nextActionButton() {
    if (!this.selectedId) {
      return 'Add website';
    }

    if (!this.audit) {
      return 'Run audit';
    }

    if (!this.performanceHistory.length) {
      return 'Check performance';
    }

    return 'Open project';
  }

  ngOnInit() {
    if (!localStorage.getItem('token')) {
      this.router.navigate(['/login']);
      return;
    }

    this.userName = localStorage.getItem('username') || 'Guest';
    this.email = localStorage.getItem('email') || '';

    const id = Number(
      localStorage.getItem('currentWebsiteId')
    );

    this.selectedId = id || null;

    this.loadAll();
  }

  setTab(tab: string) {
    this.activeTab = tab;

    if (tab === 'keywords' && this.selectedId) {
      this.loadKeywords();
    }

    if (tab === 'performance' && this.selectedId) {
      this.loadPerformance();
    }
  }

  loadAll() {
    this.api.getWebsites().subscribe({
      next: (response: any) => {

        this.websites = response || [];

        if (!this.selectedId && this.websites.length) {
          this.selectWebsite(this.websites[0].id);
        } else if (this.selectedId) {
          this.hydrate();
        }
      },

      error: () => {
        this.notify(
          'Session expired or API unavailable.',
          'error'
        );
      }
    });
  }

  hydrate() {

    const website = this.websites.find(
      item => item.id === this.selectedId
    );

    if (!website) {
      this.selectedId = null;
      return;
    }

    this.selectedDomain = website.domain;

    this.api.getPages(this.selectedId!).subscribe({
      next: (response: any) => {
        this.pageCount = (response || []).length;
      },

      error: () => {
        this.pageCount = 0;
      }
    });

    this.api.getAuditHistory(this.selectedId!).subscribe({
      next: (response: any) => {

        if (response?.length) {

          this.audit = response[0];

          this.seoScore =
            response[0].seo_score || 0;

          this.auditStatus = 'Completed';

          this.auditSuggestions =
            this.buildSuggestions(response[0]);

        } else {

          this.audit = null;

          this.auditStatus = 'Not analyzed';
        }
      },

      error: () => {
        this.audit = null;
        this.auditStatus = 'Not analyzed';
      }
    });

    this.loadPerformance();
    this.loadKeywords();
  }

  selectWebsite(id: number) {

    this.selectedId = id;

    localStorage.setItem(
      'currentWebsiteId',
      String(id)
    );

    this.hydrate();
    this.router.navigate(['/website',id]);

    this.notify(
      'Project selected',
      'ok'
    );
  }

  domainInitial(domain: string) {

    return (domain || 'W')
      .replace(/^https?:\/\//, '')
      .charAt(0)
      .toUpperCase();
  }

  openAdd() {

    this.websiteUrl = '';
    this.showAdd = true;
  }

  addWebsite() {

    if (!this.websiteUrl.trim()) {
      return;
    }

    let domain = this.websiteUrl.trim();

    if (!/^https?:\/\//i.test(domain)) {
      domain = 'https://' + domain;
    }

    this.adding = true;

    this.api.addWebsite({ domain }).subscribe({

      next: (website: any) => {

        this.websites = [
          ...this.websites,
          website
        ];

        this.showAdd = false;
        this.adding = false;

        this.selectWebsite(website.id);

        this.notify(
          'Website project created',
          'ok'
        );
      },

      error: (error: any) => {

        this.adding = false;

        this.notify(
          error?.error?.domain?.[0] ||
          'Could not add this website.',
          'error'
        );
      }
    });
  }

  deleteWebsite(id: number) {

    if (!confirm(
      'Delete this website and its project data?'
    )) {
      return;
    }

    this.api.deleteWebsite(id).subscribe({

      next: () => {

        this.websites =
          this.websites.filter(
            website => website.id !== id
          );

        if (this.selectedId === id) {

          this.selectedId = null;

          localStorage.removeItem(
            'currentWebsiteId'
          );

          this.audit = null;
          this.auditStatus = 'Not analyzed';
          this.seoScore = 0;
          this.pageCount = 0;
        }

        this.notify(
          'Website removed',
          'ok'
        );
      },

      error: () => {

        this.notify(
          'Could not delete website.',
          'error'
        );
      }
    });
  }

  runPrimaryAction() {

    if (!this.selectedId) {
      this.openAdd();
      return;
    }

    if (!this.audit) {
      this.runAudit();
      return;
    }

    if (!this.performanceHistory.length) {
      this.runPerformance();
      return;
    }

    this.setTab('websites');
  }

  runAudit() {

    if (!this.selectedId) {
      return;
    }

    this.auditStatus = 'Analyzing...';

    this.api.analyzeSEO(this.selectedId).subscribe({

      next: (response: any) => {

        this.audit =
          response.audit || response;

        this.seoScore =
          this.audit.seo_score || 0;

        this.auditSuggestions =
          response.suggestions ||
          this.buildSuggestions(this.audit);

        this.auditStatus = 'Completed';

        this.notify(
          'SEO audit completed',
          'ok'
        );
      },

      error: (error: any) => {

        this.auditStatus = 'Failed';

        this.notify(
          error?.error?.error ||
          'Audit failed. Check that the site is reachable.',
          'error'
        );
      }
    });
  }

  buildSuggestions(audit: any) {

    const suggestions: string[] = [];

    if (!audit?.title) {
      suggestions.push(
        'Add a descriptive title tag.'
      );
    }

    if (!audit?.meta_description) {
      suggestions.push(
        'Add a useful meta description.'
      );
    }

    if (!audit?.has_h1) {
      suggestions.push(
        'Add one clear H1 heading.'
      );
    }

    if ((audit?.images_missing_alt || 0) > 0) {

      suggestions.push(
        `Add alt text to ${audit.images_missing_alt} image(s).`
      );
    }

    return suggestions;
  }

  runPerformance() {

    if (!this.selectedId) {
      return;
    }

    this.api.checkPerformance(this.selectedId).subscribe({

      next: (response: any) => {

        this.speed =
          response.speed || 0;

        this.seoScore =
          response.seo_score ||
          this.seoScore;

        this.performanceStatus =
          response.status ||
          'checked';

        this.loadPerformance();

        this.notify(
          'Performance check completed',
          'ok'
        );
      },

      error: (error: any) => {

        this.notify(
          error?.error?.error ||
          'Performance check failed.',
          'error'
        );
      }
    });
  }

  getPerformanceScore(h: any): number {
    const value = Number(h?.speed ?? h?.page_speed ?? 0);
    return Math.max(0, Math.min(100, value));
  }

  getPerformanceDate(h: any): string {
    const rawDate = h?.checked_at || h?.date || h?.created_at;

    if (!rawDate) {
      return 'Recent';
    }

    const date = new Date(rawDate);

    if (isNaN(date.getTime())) {
      return String(rawDate);
    }

    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  }

  chartY(score: number): number {
    const top = 20;
    const bottom = 300;
    return bottom - ((score / 100) * (bottom - top));
  }

  updatePerformanceChart() {
    const source = [...this.performanceHistory].reverse().slice(-7);

    this.performanceChartDots = [];
    this.performanceAreaPoints = '';
    this.performanceLinePoints = '';

    if (!source.length) {
      return;
    }

    const left = 70;
    const right = 950;
    const top = 20;
    const bottom = 300;

    const step = source.length === 1
      ? 0
      : (right - left) / (source.length - 1);

    source.forEach((item: any, index: number) => {
      const score = this.getPerformanceScore(item);
      const x = source.length === 1 ? 510 : left + (step * index);
      const y = bottom - ((score / 100) * (bottom - top));

      this.performanceChartDots.push({
        x,
        y,
        score,
        label: this.getPerformanceDate(item)
      });
    });

    const linePoints = this.performanceChartDots
      .map(point => `${point.x},${point.y}`)
      .join(' ');

    this.performanceLinePoints = linePoints;

    this.performanceAreaPoints =
      `${left},${bottom} ${linePoints} ${right},${bottom}`;
  }

  loadPerformance() {

    if (!this.selectedId) {
      return;
    }

    this.api.getPerformanceHistory(
      this.selectedId
    ).subscribe({

      next: (response: any) => {

        this.performanceHistory = response || [];

        if (this.performanceHistory.length) {

          const latest = this.performanceHistory[0];

          this.speed =
            latest.speed ??
            latest.page_speed ??
            0;

          this.performanceStatus =
            latest.status ||
            'checked';

          if (!this.seoScore) {
            this.seoScore = latest.seo_score || 0;
          }
        }

        this.updatePerformanceChart();
      },

      error: () => {
        this.performanceHistory = [];
        this.updatePerformanceChart();
      }
    });
  }

  loadKeywords() {

    if (!this.selectedId) {
      return;
    }

    this.api.getKeywords(
      this.selectedId
    ).subscribe({

      next: (response: any) => {
        this.keywords = response || [];
      },

      error: () => {
        this.keywords = [];
      }
    });
  }

  suggestKeywords() {

    if (
      !this.selectedId ||
      this.keywordInput.trim().length < 2
    ) {
      return;
    }

    this.api.getKeywordSuggestions({

      website_id: this.selectedId,

      keyword:
        this.keywordInput.trim()

    }).subscribe({

      next: (response: any) => {

        this.suggestions =
          response.suggestions ||
          response.saved_keywords ||
          [];

        this.loadKeywords();

        this.notify(
          'Keyword suggestions generated',
          'ok'
        );
      },

      error: () => {

        this.notify(
          'Could not generate suggestions.',
          'error'
        );
      }
    });
  }

  saveKeyword() {

    this.saveKeywordValue(
      this.keywordInput.trim()
    );
  }

  saveKeywordValue(keyword: string) {

    if (!this.selectedId || !keyword) {
      return;
    }

    this.api.addKeyword({

      website_id: this.selectedId,

      keyword: keyword

    }).subscribe({

      next: () => {

        this.keywordInput = '';

        this.loadKeywords();

        this.notify(
          `Tracking “${keyword}”`,
          'ok'
        );
      },

      error: () => {

        this.notify(
          'Keyword could not be saved.',
          'error'
        );
      }
    });
  }

  // =========================
  // REPORTS
  // =========================

  downloadPDF() {

    if (!this.selectedId) {
      this.notify(
        'Select a website first.',
        'error'
      );
      return;
    }

    this.api.downloadPDF(
      this.selectedId
    );
  }

  downloadCSV() {

    if (!this.selectedId) {
      this.notify(
        'Select a website first.',
        'error'
      );
      return;
    }

    this.api.downloadCSV(
      this.selectedId
    );
  }

  notify(
    message: string,
    type: string
  ) {

    this.message = message;
    this.messageType = type;

    setTimeout(() => {
      this.message = '';
    }, 3200);
  }

  logout() {

    localStorage.clear();

    this.router.navigate([
      '/login'
    ]);
  }
}