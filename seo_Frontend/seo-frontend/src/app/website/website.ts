
import {Component,OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {ActivatedRoute,Router,RouterLink} from '@angular/router';
import {ApiService} from '../services/api';
@Component({selector:'app-websites',standalone:true,imports:[CommonModule,FormsModule,RouterLink],templateUrl:'./website.html',styleUrls:['./website.css']})
export class WebsitesComponent implements OnInit{
 websiteId=0;domain='';tab='overview';pages:any[]=[];keywords:any[]=[];suggestions:string[]=[];backlinks:any[]=[];notes:any[]=[];audit:any=null;seoScore=0;speed=0;busy=false;generated:any=null;generatedPage:any=null;keyword='';teamUserId:number|null=null;teamRole='editor';note='';message='';
 constructor(private route:ActivatedRoute,private api:ApiService,private router:Router){}
 ngOnInit(){const id=Number(this.route.snapshot.paramMap.get('id'));if(!id){this.router.navigate(['/dashboard']);return}this.websiteId=id;this.load()}
 get signals(){const a=this.audit||{};return[{name:'Title tag',value:a.title?'Present':'Missing',good:!!a.title},{name:'Meta description',value:a.meta_description?'Present':'Missing',good:!!a.meta_description},{name:'H1 heading',value:a.has_h1?'Present':'Missing',good:!!a.has_h1},{name:'Image alt text',value:a?`${a.images_missing_alt||0} missing`:'Not checked',good:!!a&&a.images_missing_alt===0}]}
 get auditMessage(){return this.audit?'Latest audit completed. Review the signals below.':'Run an audit to calculate your current SEO health.'}
 domainInitial(){return (this.domain||'W').replace(/^https?:\/\//,'').charAt(0).toUpperCase()}
 load(){this.api.getWebsites().subscribe(ws=>{const w=(ws||[]).find((x:any)=>x.id===this.websiteId);if(!w){this.router.navigate(['/dashboard']);return}this.domain=w.domain;this.api.getPages(this.websiteId).subscribe(r=>this.pages=r||[]);this.api.getKeywords(this.websiteId).subscribe(r=>this.keywords=r||[]);this.api.getBacklinks(this.websiteId).subscribe(r=>this.backlinks=r||[]);this.api.getNotes(this.websiteId).subscribe(r=>this.notes=r?.notes||[]);this.api.getAuditHistory(this.websiteId).subscribe(r=>{if(r?.length){this.audit=r[0];this.seoScore=this.audit.seo_score||0}})})}
 setTab(t:string){this.tab=t;if(t==='keywords')this.api.getKeywords(this.websiteId).subscribe(r=>this.keywords=r||[])}
 runCrawl(){this.busy=true;this.api.startCrawl(this.websiteId).subscribe({next:r=>{this.busy=false;this.api.getPages(this.websiteId).subscribe(p=>this.pages=p||[]);this.say(`${r.pages_added||0} new page(s) discovered.`)},error:()=>{this.busy=false;this.say('Crawl failed. Check that the domain is reachable.')}})}
 runAudit(){this.api.analyzeSEO(this.websiteId).subscribe({next:r=>{this.audit=r.audit||r;this.seoScore=this.audit.seo_score||0;this.say('SEO audit completed.')},error:()=>this.say('Audit failed.')})}
 runPerformance(){this.api.checkPerformance(this.websiteId).subscribe({next:r=>{this.speed=r.speed||0;this.say('Performance check completed.')},error:()=>this.say('Performance check failed.')})}
 suggest(){if(!this.keyword.trim())return;this.api.getKeywordSuggestions({website_id:this.websiteId,keyword:this.keyword.trim()}).subscribe({next:r=>{this.suggestions=r.suggestions||r.saved_keywords||[];this.api.getKeywords(this.websiteId).subscribe(k=>this.keywords=k||[]);this.say('Suggestions generated.')},error:()=>this.say('Could not generate suggestions.')})}
 track(){this.trackValue(this.keyword.trim())}
 trackValue(k:string){if(!k)return;this.api.addKeyword({website_id:this.websiteId,keyword:k}).subscribe({next:()=>{this.keyword='';this.api.getKeywords(this.websiteId).subscribe(r=>this.keywords=r||[]);this.say('Keyword tracked.')},error:()=>this.say('Keyword could not be saved.')})}
 generateAI(p:any){this.api.generateAI({page_id:p.id,keyword:this.keyword||'SEO'}).subscribe({next:r=>{this.generated=r;this.generatedPage=p;this.tab='content';this.say('Content suggestion generated.')},error:()=>this.say('Content generation failed.')})}
 applyContent(){if(!this.generated)return;this.api.editOptimization(this.generated.id,{title:this.generated.suggested_title,meta:this.generated.suggested_meta,content:this.generated.suggested_content}).subscribe({next:()=>this.api.applyOptimization(this.generated.id).subscribe(()=>this.say('Optimized content applied.')),error:()=>this.say('Could not apply optimization.')})}
 scanBacklinks(){this.api.scanBacklinks(this.websiteId).subscribe({next:()=>{this.api.getBacklinks(this.websiteId).subscribe(r=>this.backlinks=r||[]);this.say('Backlink scan completed.')},error:()=>this.say('Backlink scan failed.')})}
 invite(){if(!this.teamUserId)return;this.api.addTeamMember({website_id:this.websiteId,user_id:this.teamUserId,role:this.teamRole}).subscribe({next:()=>{this.teamUserId=null;this.say('Team member added.')},error:e=>this.say(e.error?.error||'Could not add member.')})}
 addNote(){if(!this.note.trim())return;this.api.addNote({website_id:this.websiteId,note:this.note.trim()}).subscribe({next:()=>{this.note='';this.api.getNotes(this.websiteId).subscribe(r=>this.notes=r?.notes||[]);this.say('Note saved.')},error:()=>this.say('Could not save note.')})}
 downloadPDF(){this.api.downloadPDF(this.websiteId)} downloadCSV(){this.api.downloadCSV(this.websiteId)}
 say(m:string){this.message=m;setTimeout(()=>this.message='',3000)}
}
