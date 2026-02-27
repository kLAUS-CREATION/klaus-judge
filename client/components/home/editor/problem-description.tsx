import React from "react"
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";

export const ProblemDescription = () => {
  return (
    <div className="h-full flex flex-col border-r border-zinc-200 dark:border-zinc-800">
      <div className="flex-1 p-0 m-0">
        <ScrollArea className="h-[calc(100vh-120px)] px-2">
          <div className="mb-8">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-3xl font-semibold tracking-tight text-zinc-900 dark:text-white mb-3">
                  Two Sum
                </h1>
              </div>
              <Badge
                variant="secondary"
                className="px-3 py-1 font-medium bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800"
              >
                Easy
              </Badge>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mt-4">
              <Badge
                variant="outline"
                className="px-2.5 py-0.5 text-xs font-normal border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300"
              >
                Array
              </Badge>
              <Badge
                variant="outline"
                className="px-2.5 py-0.5 text-xs font-normal border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300"
              >
                Hash Table
              </Badge>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-6">
            <section className="space-y-4">
              <p className="text-zinc-800 dark:text-zinc-200 leading-relaxed">
                Given an array of integers <code className="px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-sm font-mono">nums</code> and an integer <code className="px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-sm font-mono">target</code>, return indices of the two numbers such that they add up to <code className="px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-sm font-mono">target</code>.
              </p>
              <p className="text-zinc-800 dark:text-zinc-200 leading-relaxed">
                You may assume that each input would have <span className="font-semibold text-zinc-900 dark:text-white">exactly one solution</span>, and you may not use the same element twice.
              </p>
            </section>

            <section>
              <h3 className="text-sm font-semibold text-zinc-900 dark:text-white mb-3 uppercase tracking-wider">
                Example 1
              </h3>
              <div className="space-y-3 font-mono text-sm  p-4 rounded-lg border border-zinc-200 dark:border-zinc-800">
                <div className="space-y-1">
                  <span className="text-zinc-500 dark:text-zinc-400">Input:</span>
                  <p className="text-zinc-900 dark:text-white ml-4">
                    nums = [2, 7, 11, 15], target = 9
                  </p>
                </div>
                <div className="space-y-1">
                  <span className="text-zinc-500 dark:text-zinc-400">Output:</span>
                  <p className="text-zinc-900 dark:text-white ml-4">[0, 1]</p>
                </div>
                <div className="space-y-1 pt-2 border-t border-zinc-200 dark:border-zinc-800">
                  <span className="text-zinc-500 dark:text-zinc-400">Explanation:</span>
                  <p className="text-zinc-800 dark:text-zinc-300 ml-4">
                    Because nums[0] + nums[1] == 9, we return [0, 1].
                  </p>
                </div>
              </div>
            </section>

            {/* Constraints */}
            <section>
              <h3 className="text-sm font-semibold text-zinc-900 dark:text-white mb-3 uppercase tracking-wider">
                Constraints
              </h3>
              <ul className="space-y-2 text-sm text-zinc-800 dark:text-zinc-300">
                <li className="flex items-start">
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-zinc-400 dark:bg-zinc-500 mt-1.5 mr-3 flex-shrink-0"></span>
                  <span>2 ≤ nums.length ≤ 10<sup>4</sup></span>
                </li>
                <li className="flex items-start">
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-zinc-400 dark:bg-zinc-500 mt-1.5 mr-3 flex-shrink-0"></span>
                  <span>-10<sup>9</sup> ≤ nums[i] ≤ 10<sup>9</sup></span>
                </li>
                <li className="flex items-start">
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-zinc-400 dark:bg-zinc-500 mt-1.5 mr-3 flex-shrink-0"></span>
                  <span>-10<sup>9</sup> ≤ target ≤ 10<sup>9</sup></span>
                </li>
                <li className="flex items-start">
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-zinc-400 dark:bg-zinc-500 mt-1.5 mr-3 flex-shrink-0"></span>
                  <span>Only one valid answer exists.</span>
                </li>
              </ul>
            </section>
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};
