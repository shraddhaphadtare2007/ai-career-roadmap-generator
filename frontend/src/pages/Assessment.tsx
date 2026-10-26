import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight, CheckCircle2, ClipboardList, Loader2, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ProgressBar } from "@/components/Progress";
import { apiPost, ApiError } from "@/lib/api";
import { QUESTIONS, type AssessmentAnswers } from "@/lib/questions";
import { toast } from "sonner";
import { queryClient } from "@/lib/queryClient";

const EMPTY: AssessmentAnswers = {
  education: "",
  interests: [],
  skills: [],
  skill_level: "",
  enjoyment: [],
  study_time: "",
  career_goal: "",
  learning_style: "",
};

export default function Assessment() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<AssessmentAnswers>(EMPTY);
  const [submitting, setSubmitting] = useState(false);

  const question = QUESTIONS[step];
  const isLast = step === QUESTIONS.length - 1;

  const setSingle = (key: keyof AssessmentAnswers, value: string) => {
    setAnswers((a) => ({ ...a, [key]: value }));
  };

  const toggleMulti = (key: keyof AssessmentAnswers, option: string) => {
    setAnswers((a) => {
      const current = a[key] as string[];
      if (option === "None") {
        return {
          ...a,
          [key]: current.includes("None") ? [] : ["None"],
        };
      }
      const next = current.includes(option)
        ? current.filter((x) => x !== option)
        : [...current.filter((x) => x !== "None"), option];
      return { ...a, [key]: next };
    });
  };

  const validate = () => {
    const value = answers[question.key];
    const answered = question.multi ? (value as string[]).length > 0 : Boolean(value);
    if (!answered) {
      toast.error("Please answer this question before continuing.");
      return false;
    }
    return true;
  };

  const next = () => {
    if (validate()) setStep((s) => s + 1);
  };

  const submit = async () => {
    for (let i = 0; i < QUESTIONS.length; i++) {
      const q = QUESTIONS[i];
      const value = answers[q.key];
      const answered = q.multi ? (value as string[]).length > 0 : Boolean(value);
      if (!answered) {
        setStep(i);
        toast.error(`Question ${i + 1} is still unanswered.`);
        return;
      }
    }

    setSubmitting(true);
    try {
      await apiPost("/assessment", answers);
      await queryClient.invalidateQueries();
      toast.success("Assessment complete — here is your match!");
      navigate("/results");
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        toast.error("Your session expired. Please log in again.");
        navigate("/login");
      } else {
        toast.error("Could not save the assessment. Please try again.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  const isSelected = (option: string) => {
    if (question.multi) {
      return (answers[question.key] as string[]).includes(option);
    }
    return answers[question.key] === option;
  };

  return (
    <div className="mx-auto max-w-3xl py-6">
      <Card className="border-slate-800 bg-slate-900/80 shadow-2xl backdrop-blur-md">
        <CardContent className="p-6 md:p-10 space-y-8">
          {/* Header & Step progress */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="flex items-center gap-2 font-medium text-sky-400">
                <ClipboardList className="h-4 w-4" />
                Question {step + 1} of {QUESTIONS.length}
              </span>
              <span className="text-slate-400">
                {Math.round(((step + 1) / QUESTIONS.length) * 100)}% Completed
              </span>
            </div>
            <ProgressBar value={step + 1} max={QUESTIONS.length} />
          </div>

          {/* Question title & instructions */}
          <div className="space-y-2">
            <h1 className="font-heading text-2xl font-bold text-white md:text-3xl">
              {question.title}
            </h1>
            <p className="text-sm text-slate-400">{question.help}</p>
            {question.multi && (
              <span className="inline-block rounded bg-sky-500/10 px-2 py-0.5 text-xs font-semibold text-sky-300">
                Select all that apply
              </span>
            )}
          </div>

          {/* Options Grid */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {question.options.map((opt) => {
              const active = isSelected(opt);
              return (
                <button
                  key={opt}
                  type="button"
                  onClick={() => {
                    if (question.multi) toggleMulti(question.key, opt);
                    else setSingle(question.key, opt);
                  }}
                  className={`flex items-center justify-between rounded-xl border p-4 text-left font-medium transition-all cursor-pointer ${
                    active
                      ? "border-sky-500 bg-sky-500/15 text-white shadow-md shadow-sky-500/10"
                      : "border-slate-800 bg-slate-950/40 text-slate-300 hover:border-slate-700 hover:bg-slate-850"
                  }`}
                >
                  <span>{opt}</span>
                  {active && <CheckCircle2 className="h-5 w-5 text-sky-400" />}
                </button>
              );
            })}
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center justify-between pt-6 border-t border-slate-800">
            <Button
              variant="outline"
              onClick={() => setStep((s) => Math.max(0, s - 1))}
              disabled={step === 0 || submitting}
              className="gap-2 border-slate-700"
            >
              <ArrowLeft className="h-4 w-4" /> Previous
            </Button>

            {isLast ? (
              <Button
                onClick={submit}
                disabled={submitting}
                className="gap-2 bg-emerald-600 hover:bg-emerald-500 text-white"
              >
                {submitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" /> Calculating Match...
                  </>
                ) : (
                  <>
                    Complete Assessment <Send className="h-4 w-4" />
                  </>
                )}
              </Button>
            ) : (
              <Button onClick={next} className="gap-2 bg-sky-500 hover:bg-sky-400">
                Next <ArrowRight className="h-4 w-4" />
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
