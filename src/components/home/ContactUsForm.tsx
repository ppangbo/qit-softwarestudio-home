import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { cn } from "@/lib/utils";

// 定义表单验证模式
const formSchema = z.object({
  name: z.string().min(2, { message: "姓名至少需要2个字符" }),
  email: z.string().email({ message: "请输入有效的电子邮件地址" }),
  message: z.string().min(10, { message: "留言至少需要10个字符" }),
});

type FormValues = z.infer<typeof formSchema>;

export function ContactForm() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isSubmitSuccessful },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      message: "",
    },
  });

  const [submitStatus, setSubmitStatus] = React.useState<
    "idle" | "success" | "error"
  >("idle");

  async function onSubmit(data: FormValues) {
    try {
      // 这里可以添加实际的表单提交逻辑，例如发送到后端API
      console.log("表单数据:", data);

      // 模拟API调用
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // 重置表单
      reset();
      setSubmitStatus("success");

      // 3秒后重置状态
      setTimeout(() => setSubmitStatus("idle"), 3000);
    } catch (error) {
      console.error("提交表单时出错:", error);
      setSubmitStatus("error");

      // 3秒后重置状态
      setTimeout(() => setSubmitStatus("idle"), 3000);
    }
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6 max-w-md mx-auto"
    >
      <div className="space-y-2">
        <label
          htmlFor="name"
          className="block text-sm font-medium leading-none mb-1.5 text-foreground/90 peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          姓名
        </label>
        <input
          id="name"
          placeholder="请输入您的姓名"
          className={cn(
            "flex h-11 w-full rounded-lg border border-input bg-background/50 px-4 py-2 text-sm shadow-sm transition-colors ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground/80 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary focus-visible:border-primary focus-visible:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50",
            errors.name
              ? "border-destructive focus-visible:ring-destructive focus-visible:border-destructive"
              : ""
          )}
          {...register("name")}
        />
        {errors.name && (
          <p className="text-sm font-medium text-destructive mt-1 flex items-center gap-1">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="w-4 h-4"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z"
                clipRule="evenodd"
              />
            </svg>
            {errors.name.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <label
          htmlFor="email"
          className="block text-sm font-medium leading-none mb-1.5 text-foreground/90 peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          电子邮件
        </label>
        <input
          id="email"
          type="email"
          placeholder="请输入您的电子邮件"
          className={cn(
            "flex h-11 w-full rounded-lg border border-input bg-background/50 px-4 py-2 text-sm shadow-sm transition-colors ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground/80 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary focus-visible:border-primary focus-visible:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50",
            errors.email
              ? "border-destructive focus-visible:ring-destructive focus-visible:border-destructive"
              : ""
          )}
          {...register("email")}
        />
        {errors.email && (
          <p className="text-sm font-medium text-destructive mt-1 flex items-center gap-1">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="w-4 h-4"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z"
                clipRule="evenodd"
              />
            </svg>
            {errors.email.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <label
          htmlFor="message"
          className="block text-sm font-medium leading-none mb-1.5 text-foreground/90 peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          留言
        </label>
        <textarea
          id="message"
          placeholder="请输入您的留言内容"
          className={cn(
            "flex min-h-[140px] w-full rounded-lg border border-input bg-background/50 px-4 py-3 text-sm shadow-sm transition-colors ring-offset-background placeholder:text-muted-foreground/80 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary focus-visible:border-primary focus-visible:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50 resize-none",
            errors.message
              ? "border-destructive focus-visible:ring-destructive focus-visible:border-destructive"
              : ""
          )}
          {...register("message")}
        />
        {errors.message && (
          <p className="text-sm font-medium text-destructive mt-1 flex items-center gap-1">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="w-4 h-4"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z"
                clipRule="evenodd"
              />
            </svg>
            {errors.message.message}
          </p>
        )}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="inline-flex h-11 w-full items-center justify-center rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground ring-offset-background transition-all hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 shadow-sm hover:shadow mt-2"
      >
        {isSubmitting ? (
          <>
            <svg
              className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            提交中...
          </>
        ) : (
          <>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-1.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
              />
            </svg>
            发送留言
          </>
        )}
      </button>

      {submitStatus === "success" && (
        <div className="mt-4 rounded-lg bg-green-50 p-4 border border-green-200 shadow-sm dark:bg-green-900/20 dark:border-green-800/30 animate-fadeIn">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-green-100 dark:bg-green-800/40 rounded-full p-1">
              <svg
                className="h-5 w-5 text-green-500 dark:text-green-400"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-green-800 dark:text-green-200">
                留言已成功发送！感谢您的反馈。
              </p>
            </div>
          </div>
        </div>
      )}

      {submitStatus === "error" && (
        <div className="mt-4 rounded-lg bg-red-50 p-4 border border-red-200 shadow-sm dark:bg-red-900/20 dark:border-red-800/30 animate-fadeIn">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-red-100 dark:bg-red-800/40 rounded-full p-1">
              <svg
                className="h-5 w-5 text-red-500 dark:text-red-400"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-red-800 dark:text-red-200">
                发送留言时出错，请稍后再试！
              </p>
            </div>
          </div>
        </div>
      )}
    </form>
  );
}
