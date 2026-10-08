
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export const BASE_URL = 'https://seovault.onrender.com/api';

@Injectable({providedIn:'root'})
export class ApiService {
  constructor(private http: HttpClient) {}
  private options() {
    const token=localStorage.getItem('token');
    return {headers:new HttpHeaders({'Authorization':`Bearer ${token}`})};
  }
  login(data:any):Observable<any>{return this.http.post(`${BASE_URL}/accounts/login/`,data)}
  register(data:any):Observable<any>{return this.http.post(`${BASE_URL}/accounts/register/`,data)}
  getWebsites():Observable<any>{return this.http.get(`${BASE_URL}/websites/`,this.options())}
  addWebsite(data:any):Observable<any>{return this.http.post(`${BASE_URL}/websites/`,data,this.options())}
  deleteWebsite(id:number):Observable<any>{return this.http.delete(`${BASE_URL}/websites/${id}/`,this.options())}
  getPages(id:number):Observable<any>{return this.http.get(`${BASE_URL}/pages/?website=${id}`,this.options())}
  deletePage(id:number):Observable<any>{return this.http.delete(`${BASE_URL}/pages/${id}/`,this.options())}
  startCrawl(id:number):Observable<any>{return this.http.post(`${BASE_URL}/pages/fetch/`,{website_id:id},this.options())}
  analyzeSEO(id:number):Observable<any>{return this.http.post(`${BASE_URL}/seo-analyze/`,{website_id:id},this.options())}
  getAuditHistory(id:number):Observable<any>{return this.http.get(`${BASE_URL}/seo-history/${id}/`,this.options())}
  checkPerformance(id:number):Observable<any>{return this.http.post(`${BASE_URL}/performance/track/`,{website_id:id},this.options())}
  getPerformanceHistory(id:number):Observable<any>{return this.http.get(`${BASE_URL}/performance/${id}/`,this.options())}
  addKeyword(data:any):Observable<any>{return this.http.post(`${BASE_URL}/keywords/add/`,data,this.options())}
  getKeywords(id:number):Observable<any>{return this.http.get(`${BASE_URL}/keywords/${id}/`,this.options())}
  getKeywordSuggestions(data:any):Observable<any>{return this.http.post(`${BASE_URL}/keywords/suggest/`,data,this.options())}
  generateAI(data:any):Observable<any>{return this.http.post(`${BASE_URL}/content/generate/`,data,this.options())}
  editOptimization(id:number,data:any):Observable<any>{return this.http.put(`${BASE_URL}/content/edit/${id}/`,data,this.options())}
  applyOptimization(id:number):Observable<any>{return this.http.post(`${BASE_URL}/content/apply/${id}/`,{},this.options())}
  scanBacklinks(id:number):Observable<any>{return this.http.post(`${BASE_URL}/backlinks/scan/`,{website_id:id},this.options())}
  getBacklinks(id:number):Observable<any>{return this.http.get(`${BASE_URL}/backlinks/${id}/`,this.options())}
  addTeamMember(data:any):Observable<any>{return this.http.post(`${BASE_URL}/team/add/`,data,this.options())}
  addNote(data:any):Observable<any>{return this.http.post(`${BASE_URL}/notes/add/`,data,this.options())}
  getNotes(id:number):Observable<any>{return this.http.get(`${BASE_URL}/notes/${id}/`,this.options())}
  downloadPDF(id:number){return this.download(`${BASE_URL}/reports/pdf/${id}/`,'seo-report.pdf')}
  downloadCSV(id:number){return this.download(`${BASE_URL}/reports/csv/${id}/`,'seo-report.csv')}
  private download(url:string,name:string){return this.http.get(url,{...this.options(),responseType:'blob'}).subscribe(blob=>{const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=name;a.click();URL.revokeObjectURL(a.href)})}
}
