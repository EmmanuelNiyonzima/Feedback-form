import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAppStore } from '../store/AppContext';
import { FieldType, FormResponse } from '../types';
import { CheckCircle2, Star, Send, ArrowLeft, Loader2 } from 'lucide-react';

const SubmitForm: React.FC = () => {
  const { formId } = useParams<{ formId: string }>();
  const { getForm, addResponse, institutions } = useAppStore();
  const [submitted, setSubmitted] = useState(false);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  
  const form = formId ? getForm(formId) : undefined;
  const institution = form ? institutions.find(i => i.id === form.institutionId) : undefined;
  const brandColor = institution?.primaryColor || '#4f46e5';
  const logo = institution?.logoUrl;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (!form) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
        <div className="max-w-md w-full bg-white p-10 rounded-3xl shadow-xl text-center border border-slate-100">
          <div className="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
             <ArrowLeft size={40} />
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Form Not Found</h2>
          <p className="text-slate-500 mb-8">This form may have been deleted or the link is incorrect.</p>
          <Link to="/" className="inline-block bg-slate-900 text-white px-8 py-3 rounded-xl font-bold">Return to App</Link>
        </div>
      </div>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const missingFields = form.fields.filter(f => f.required && (answers[f.id] === undefined || answers[f.id] === ''));
    if (missingFields.length > 0) {
      alert(`Please answer all required questions.`);
      return;
    }
    const response: FormResponse = {
      id: crypto.randomUUID(),
      formId: form.id,
      submittedAt: new Date().toISOString(),
      answers
    };
    addResponse(response);
    setSubmitted(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleChange = (fieldId: string, value: any) => {
    setAnswers(prev => ({ ...prev, [fieldId]: value }));
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4" style={{ background: `linear-gradient(135deg, ${brandColor}15, #f8fafc)` }}>
        <div className="bg-white p-12 rounded-3xl shadow-2xl shadow-slate-200 max-w-md w-full text-center border border-white">
          <div className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-8 bg-emerald-100 text-emerald-600">
            <CheckCircle2 size={48} strokeWidth={3} className="animate-in zoom-in duration-500" />
          </div>
          <h2 className="text-3xl font-extrabold text-slate-900 mb-4 tracking-tight">Thank You!</h2>
          <p className="text-slate-500 mb-10 text-lg leading-relaxed">Your feedback has been successfully recorded.</p>
          <button 
            onClick={() => { setAnswers({}); setSubmitted(false); }}
            className="font-bold px-6 py-2 rounded-lg transition-all"
            style={{ color: brandColor, border: `2px solid ${brandColor}` }}
          >
            Submit Another Response
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-20">
      <div className="min-h-[700px] w-full relative overflow-hidden flex flex-col items-center justify-center text-center px-6" style={{ backgroundColor: brandColor }}>
         <div className="absolute inset-0 opacity-10">
           <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
             <path d="M0 100 C 20 0 50 0 100 100 Z" fill="white" />
           </svg>
         </div>
         <div className="relative z-10 text-white max-w-5xl flex flex-col items-center">
            {logo && (
              <div className="mb-12 bg-white p-12 rounded-[5rem] shadow-[0_35px_60px_-15px_rgba(0,0,0,0.3)] border-4 border-white animate-in fade-in zoom-in duration-1000">
                <img 
                  src={logo} 
                  alt="Institutional Logo" 
                  className="h-64 md:h-80 object-contain drop-shadow-xl" 
                />
              </div>
            )}
            <h1 className="text-6xl md:text-9xl font-black tracking-tighter drop-shadow-2xl mb-4">{form.title}</h1>
            {institution && <p className="text-xl md:text-2xl font-bold opacity-80 uppercase tracking-widest">{institution.name}</p>}
         </div>
      </div>

      <div className="max-w-2xl mx-auto -mt-32 px-4 relative z-20">
        <div className="bg-white rounded-[60px] shadow-2xl shadow-slate-200 overflow-hidden border border-white">
          <div className="p-10 md:p-16 border-b border-slate-50">
            <p className="text-2xl md:text-3xl text-slate-600 leading-relaxed text-center font-medium italic">"{form.description}"</p>
          </div>

          <form onSubmit={handleSubmit} className="p-10 md:p-16 space-y-20">
            {form.fields.map((field, idx) => (
              <div key={field.id} className="animate-in fade-in slide-in-from-bottom-4 duration-500" style={{ animationDelay: `${idx * 100}ms` }}>
                <label className="block text-3xl font-black text-slate-800 mb-10">
                  <span className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-slate-100 text-slate-400 text-2xl font-black mr-6">{idx + 1}</span>
                  {field.label}
                  {field.required && <span className="text-red-500 ml-1">*</span>}
                </label>

                {field.type === FieldType.TEXT && (
                  <textarea
                    required={field.required}
                    className="w-full p-10 text-2xl bg-slate-50 border-4 border-slate-100 rounded-[40px] focus:bg-white outline-none transition-all resize-none min-h-[250px] focus:border-indigo-500 shadow-inner"
                    placeholder="Tell us more about your experience..."
                    value={answers[field.id] || ''}
                    onChange={(e) => handleChange(field.id, e.target.value)}
                  />
                )}

                {field.type === FieldType.RATING && (
                  <div className="flex justify-between max-w-lg mx-auto">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => handleChange(field.id, star)}
                        className={`w-20 h-20 rounded-[30px] transition-all flex items-center justify-center ${
                          answers[field.id] >= star 
                            ? 'text-white shadow-2xl scale-110' 
                            : 'bg-slate-50 text-slate-300 hover:bg-slate-100'
                        }`}
                        style={answers[field.id] >= star ? { backgroundColor: brandColor } : {}}
                      >
                        <Star fill={answers[field.id] >= star ? "currentColor" : "none"} size={40} />
                      </button>
                    ))}
                  </div>
                )}

                {field.type === FieldType.YESNO && (
                  <div className="grid grid-cols-2 gap-10">
                    {['Yes', 'No'].map(opt => (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => handleChange(field.id, opt)}
                        className={`py-10 rounded-[35px] border-4 font-black text-3xl transition-all ${
                          answers[field.id] === opt 
                            ? 'bg-slate-50 shadow-inner scale-[0.98]' 
                            : 'border-slate-50 bg-slate-50 text-slate-400 hover:border-slate-200'
                        }`}
                        style={answers[field.id] === opt ? { borderColor: brandColor, color: brandColor } : {}}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                )}

                 {field.type === FieldType.CHOICE && (
                  <div className="space-y-6">
                    {field.options?.map(opt => (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => handleChange(field.id, opt)}
                        className={`w-full text-left p-10 rounded-[35px] border-4 transition-all flex items-center justify-between ${
                          answers[field.id] === opt 
                            ? 'bg-slate-50 shadow-inner' 
                            : 'border-slate-50 bg-slate-50 hover:bg-white'
                        }`}
                        style={answers[field.id] === opt ? { borderColor: brandColor } : {}}
                      >
                        <span className={`text-2xl ${answers[field.id] === opt ? 'font-black' : 'text-slate-600'}`}
                           style={answers[field.id] === opt ? { color: brandColor } : {}}
                        >{opt}</span>
                        {answers[field.id] === opt && <CheckCircle2 size={40} style={{ color: brandColor }} />}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}

            <div className="pt-20">
              <button
                type="submit"
                className="w-full text-white text-4xl font-black py-12 rounded-[50px] shadow-2xl hover:brightness-110 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-6"
                style={{ backgroundColor: brandColor }}
              >
                Submit Feedback <Send size={40} />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SubmitForm;